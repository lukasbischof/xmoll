/// The allowed intervals expressed in semitones distance. One integer value = one semitone = 100 cents.
import Note from "./Note.ts";

export type SemitoneDistance = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
export type Interval = [Note, Note];

export interface Config {
    selectedIntervals: SemitoneDistance[];
    rounds: number;
    examMode: boolean;
}

export default class GameState {
    public readonly config: Config;
    public playedIntervals: Interval[] = [];

    constructor(config: Config) {
        this.config = config;
    }

    public pushInterval(interval: Interval) {
        this.playedIntervals.push(interval);
    }

    get currentInterval(): Interval {
        if (this.playedIntervals.length === 0) {
            throw new Error("No interval played yet");
        }

        return this.playedIntervals[this.playedIntervals.length - 1];
    }

    public toJson() {
        return {
            playedIntervals: this.playedIntervals.map((interval) => interval.map((note) => note.index)),
            config: {
                selectedIntervals: this.config.selectedIntervals,
                rounds: Number.isFinite(this.config.rounds) ? this.config.rounds : "Infinity",
                examMode: this.config.examMode,
            },
        };
    }

    static fromJson(json: ReturnType<typeof GameState.prototype.toJson>) {
        const { config } = json;
        const gameState = new GameState({
            selectedIntervals: config.selectedIntervals,
            rounds: Number(config.rounds),
            examMode: config.examMode,
        });

        gameState.playedIntervals = json.playedIntervals.map((interval) => {
            return interval.map((index) => new Note(index)) as Interval;
        });

        return gameState;
    }
}
