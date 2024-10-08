import type { SemitoneDistance } from "./AbsoluteInterval.ts";
import GameState from "./GameState.ts";
import { loadGrandPianoSource } from "./GrandPiano.ts";
import type Note from "./Note.ts";
import type { Source } from "./Source.ts";
import { debug } from "./logger.ts";
import { playSound, selectRandomIntervalFromSource } from "./utils.ts";

export default class Game {
    private source?: Source;
    private audioContext: AudioContext;
    public readonly state: GameState;

    static get currentGame() {
        return window.currentGame;
    }

    static async startNewGame(
        selectedIntervals: SemitoneDistance[] = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
        rounds: number = Number.POSITIVE_INFINITY,
        examMode = false
    ) {
        window.currentGame = new Game(new GameState({ selectedIntervals, rounds, examMode }));
        await window.currentGame.preloadAudioFiles();
    }

    constructor(state: GameState) {
        this.audioContext = new AudioContext();
        this.state = state;
    }

    async preloadAudioFiles() {
        this.source = await loadGrandPianoSource(this.audioContext);
    }

    selectRandomInterval() {
        if (!this.source) {
            throw new Error("Audio files not loaded");
        }

        this.state.pushInterval(selectRandomIntervalFromSource(this.source, this.state.config.selectedIntervals));
    }

    playCurrentInterval() {
        debug("Playing current interval");
        const load = async () => {
            if (this.audioContext.state !== "running") {
                this.audioContext = new AudioContext();
                await this.preloadAudioFiles();
                debug("Audio context restarted");
            }
        };

        return new Promise<void>((resolve) => {
            load().then(() => {
                this.playNote(this.state.currentInterval.lower);
                setTimeout(() => {
                    this.playNote(this.state.currentInterval.upper, () => {
                        if (this.state.currentInterval.lower.index !== this.state.currentInterval.upper.index) {
                            this.playNote(this.state.currentInterval.lower);
                            this.playNote(this.state.currentInterval.upper, resolve);
                        } else {
                            resolve();
                        }
                    });
                }, 1000);
            });
        });
    }

    provideAnswer(distance: SemitoneDistance) {
        const correct = this.state.answerInterval(distance);
        this.save();
        return correct;
    }

    transitionToNextInterval() {
        this.selectRandomInterval();
        void this.playCurrentInterval();
        this.save();
    }

    save() {
        localStorage.setItem("game", JSON.stringify(this.state.toJson()));
    }

    static restore() {
        const json = localStorage.getItem("game");
        if (!json) {
            throw new Error("Game not found in local storage");
        }

        window.currentGame = new Game(GameState.fromJson(JSON.parse(json)));
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
