import { loadGrandPianoSource } from "./GrandPiano.ts";
import Note from "./Note.ts";
import type { Source } from "./Source.ts";

/// The allowed intervals expressed in semitones distance. One integer value = one semitone = 100 cents.
export type Interval = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export default class Game {
    private source?: Source;
    private audioContext: AudioContext;
    private readonly selectedIntervals: Interval[];
    public readonly rounds: number;
    public currentNotes: [Note, Note] = [new Note(0), new Note(0)];

    static get currentGame() {
        return window.currentGame;
    }

    static async startNewGame(
        selectedIntervals: Interval[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        rounds: number = Number.POSITIVE_INFINITY
    ) {
        window.currentGame = new Game(selectedIntervals, rounds);
        await window.currentGame.preloadAudioFiles();
    }

    static restoreGame() {
        const json = localStorage.getItem("game");
        if (!json) {
            throw new Error("Game not found in local storage");
        }

        window.currentGame = Game.fromJson(JSON.parse(json));
    }

    constructor(selectedIntervals: Interval[], rounds: number) {
        this.audioContext = new AudioContext();
        this.selectedIntervals = selectedIntervals;
        this.rounds = rounds;
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
        const load = async () => {
            if (this.audioContext.state !== "running") {
                this.audioContext = new AudioContext();
                await this.preloadAudioFiles();
                console.log("Audio context restarted");
            }
        };

        return new Promise<void>((resolve) => {
            load().then(() => {
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
        });
    }

    transitionToNextInterval() {
        this.selectRandomInterval();
        void this.playCurrentInterval();
        this.save();
    }

    save() {
        localStorage.setItem("game", JSON.stringify(this.toJson()));
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

    private toJson() {
        return {
            selectedIntervals: this.selectedIntervals,
            currentNotes: this.currentNotes.map((note) => note.index),
            rounds: Number.isFinite(this.rounds) ? this.rounds : "Infinity",
        };
    }

    private static fromJson(json: ReturnType<Game["toJson"]>) {
        const game = new Game(json.selectedIntervals, Number(json.rounds));
        game.currentNotes = [new Note(json.currentNotes[0]), new Note(json.currentNotes[1])];
        return game;
    }
}

declare global {
    interface Window {
        currentGame: Game;
    }
}
