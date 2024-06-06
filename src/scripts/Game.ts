import { loadGrandPianoSource } from "./GrandPiano.ts";
import Note from "./Note.ts";
import type { Source } from "./Source.ts";

/// The allowed intervals expressed in semitones distance. One integer value = one semitone = 100 cents.
export type Interval = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export default class Game {
    static currentGame: Game | undefined;
    private source?: Source;
    private readonly audioContext: AudioContext;
    private readonly selectedIntervals: Interval[];
    public currentNotes: [Note, Note] = [new Note(0), new Note(0)];

    static async startNewGame(selectedIntervals: Interval[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]) {
        Game.currentGame = new Game(selectedIntervals);
        await Game.currentGame.preloadAudioFiles();
    }

    constructor(selectedIntervals: Interval[]) {
        this.audioContext = new AudioContext();
        this.selectedIntervals = selectedIntervals;
    }

    async preloadAudioFiles() {
        this.source = await loadGrandPianoSource(this.audioContext);
    }

    selectRandomInterval() {
        if (!this.source) {
            throw new Error("Audio files not loaded");
        }

        const notesRange = Object.keys(this.source).map(Number);
        const currentInterval = this.selectedIntervals[Math.floor(Math.random() * this.selectedIntervals.length)];
        const lowerIndex = notesRange[Math.floor(Math.random() * (notesRange.length - currentInterval))];
        const higherIndex = lowerIndex + currentInterval;

        console.log(`Selected interval: ${new Note(lowerIndex)} - ${new Note(higherIndex)}`);

        this.currentNotes = [new Note(lowerIndex), new Note(higherIndex)];
    }

    playCurrentInterval() {
        return new Promise<void>((resolve) => {
            this.playNote(this.currentNotes[0]);
            setTimeout(() => {
                this.playNote(this.currentNotes[1], () => {
                    if (this.currentNotes[0].index !== this.currentNotes[1].index) {
                        this.playNote(this.currentNotes[0]);
                        this.playNote(this.currentNotes[1], resolve);
                    } else {
                        resolve();
                    }
                });
            }, 1000);
        });
    }

    transitionToNextInterval() {
        this.selectRandomInterval();
        this.playCurrentInterval();
    }

    private playNote(note: Note, onended?: () => void) {
        const audioBuffer = this.source?.[note.index];
        if (!audioBuffer) {
            throw new Error("Audio buffer not found");
        }

        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.audioContext.destination);

        if (onended) source.onended = onended;

        source.start();
    }
}
