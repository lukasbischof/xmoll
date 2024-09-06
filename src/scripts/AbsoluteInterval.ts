import Note from "./Note.ts";

// Distance in cents between two notes
export type SemitoneDistance = 0 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000 | 1100 | 1200;

export default class AbsoluteInterval {
    public readonly lower: Note;
    public readonly upper: Note;

    constructor(lower: Note, upper: Note) {
        this.lower = lower;
        this.upper = upper;
    }

    public get distance(): SemitoneDistance {
        return this.lower.distanceTo(this.upper) as SemitoneDistance;
    }

    public toJson() {
        return [this.lower.index, this.upper.index];
    }

    static fromJson(json: ReturnType<typeof AbsoluteInterval.prototype.toJson>) {
        return new AbsoluteInterval(new Note(json[0]), new Note(json[1]));
    }

    [Symbol.toPrimitive](hint: string) {
        if (hint === "string") {
            return `${this.lower.toString()} - ${this.upper.toString()} (${this.distance} cents)`;
        }

        return null;
    }
}
