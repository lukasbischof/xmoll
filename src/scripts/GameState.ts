import AbsoluteInterval, { type SemitoneDistance } from "./AbsoluteInterval.ts";

export interface Config {
    selectedIntervals: SemitoneDistance[];
    rounds: number;
    examMode: boolean;
}

export default class GameState {
    public readonly config: Config;
    public playedIntervals: AbsoluteInterval[] = [];
    public answeredIntervals: SemitoneDistance[] = [];

    constructor(config: Config) {
        this.config = config;
    }

    public pushInterval(interval: AbsoluteInterval) {
        this.playedIntervals.push(interval);
    }

    public answerInterval(distance: SemitoneDistance) {
        this.answeredIntervals.push(distance);

        return distance === this.currentInterval.distance;
    }

    get currentInterval(): AbsoluteInterval {
        if (this.playedIntervals.length === 0) {
            throw new Error("No interval played yet");
        }

        return this.playedIntervals[this.playedIntervals.length - 1];
    }

    public toJson() {
        return {
            playedIntervals: this.playedIntervals.map((interval) => interval.toJson()),
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
            return AbsoluteInterval.fromJson(interval);
        });

        return gameState;
    }
}
