import Note from "./Note.ts";

// Distance in cents between two notes
export type SemitoneDistance = 0 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000 | 1100 | 1200;
export type Interval = [Note, Note];

export interface Config {
    selectedIntervals: SemitoneDistance[];
    rounds: number;
    examMode: boolean;
}

export default class GameState {
    public readonly config: Config;
    public playedIntervals: Interval[] = [];
    public answeredIntervals: SemitoneDistance[] = [];

    constructor(config: Config) {
        this.config = config;
    }

    public pushInterval(interval: Interval) {
        this.playedIntervals.push(interval);
    }

    public answerInterval(distance: SemitoneDistance) {
        this.answeredIntervals.push(distance);

        const correctDistance = this.currentInterval[0].distanceTo(this.currentInterval[1]);
        return distance === correctDistance;
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
