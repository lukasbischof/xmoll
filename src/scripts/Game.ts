import GameState, { type SemitoneDistance } from "./GameState.ts";
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
        selectedIntervals: SemitoneDistance[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
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
        const load = async () => {
            if (this.audioContext.state !== "running") {
                this.audioContext = new AudioContext();
                await this.preloadAudioFiles();
                debug("Audio context restarted");
            }
        };

        return new Promise<void>((resolve) => {
            load().then(() => {
                this.playNote(this.state.currentInterval[0]);
                setTimeout(() => {
                    this.playNote(this.state.currentInterval[1], () => {
                        if (this.state.currentInterval[0].index !== this.state.currentInterval[1].index) {
                            this.playNote(this.state.currentInterval[0]);
                            this.playNote(this.state.currentInterval[1], resolve);
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
