import { loadGrandPianoSource } from "./GrandPiano.ts";
import Note from "./Note.ts";
import type { Source } from "./Source.ts";
import { debug } from "./logger.ts";
import { playSound, saveGame, selectRandomIntervalFromSource } from "./utils.ts";

/// The allowed intervals expressed in semitones distance. One integer value = one semitone = 100 cents.
export type SemitoneDistance = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
export type Interval = [Note, Note];

interface Config {
    selectedIntervals: SemitoneDistance[];
    rounds: number;
    examMode: boolean;
}

export default class Game {
    private source?: Source;
    private audioContext: AudioContext;
    public readonly config: Config;
    public currentRound = 0;
    public currentInterval: Interval = [new Note(0), new Note(0)];

    static get currentGame() {
        return window.currentGame;
    }

    static async startNewGame(
        selectedIntervals: SemitoneDistance[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        rounds: number = Number.POSITIVE_INFINITY,
        examMode = false
    ) {
        window.currentGame = new Game({ selectedIntervals, rounds, examMode });
        await window.currentGame.preloadAudioFiles();
    }

    constructor(config: Config) {
        this.audioContext = new AudioContext();
        this.config = config;
    }

    async preloadAudioFiles() {
        this.source = await loadGrandPianoSource(this.audioContext);
    }

    selectRandomInterval() {
        if (!this.source) {
            throw new Error("Audio files not loaded");
        }

        this.currentInterval = selectRandomIntervalFromSource(this.source, this.config.selectedIntervals);
    }

    playCurrentInterval() {
        const load = async () => {
            if (this.audioContext.state !== "running") {
                this.audioContext = new AudioContext();
                await this.preloadAudioFiles();
                debug("Audio context restarted");
            }
        };

        return new Promise<void>((resolve) => {
            load().then(() => {
                this.playNote(this.currentInterval[0]);
                setTimeout(() => {
                    this.playNote(this.currentInterval[1], () => {
                        if (this.currentInterval[0].index !== this.currentInterval[1].index) {
                            this.playNote(this.currentInterval[0]);
                            this.playNote(this.currentInterval[1], resolve);
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
        saveGame(this);
    }

    private playNote(note: Note, onended?: () => void) {
        const audioBuffer = this.source?.[note.index];
        if (!audioBuffer) throw new Error(`Audio buffer is ${audioBuffer}`);

        playSound(audioBuffer, this.audioContext, onended);
    }
}

declare global {
    interface Window {
        currentGame: Game;
    }
}
