const NOTE_SCALE = ["C_", "C#_", "D_", "D#_", "E_", "F_", "F#_", "G_", "G#_", "A_", "A#_", "H_"];

export type NoteIndex = number;
export type NoteString = `${"A" | "C" | "D" | "E" | "F" | "G" | "H"}${"" | "#"}${NoteIndex}`;

export default class Note {
    index: number;

    constructor(index: number) {
        this.index = index;
    }

    static fromString(note: NoteString) {
        if (!/[ACDEFGH]#?\d/.test(note)) {
            throw new Error("Invalid note format");
        }

        const octave = Number.parseInt(note.replace(/[ACDEFGH]#?/, ""));
        const noteIndex = NOTE_SCALE.indexOf(note.replace(octave.toString(), "_"));
        if (noteIndex === -1) {
            throw new Error("Invalid note");
        }

        return new Note(noteIndex + octave * NOTE_SCALE.length);
    }

    get octave() {
        return Math.floor(this.index / NOTE_SCALE.length);
    }

    get indexInOctave() {
        return this.index % NOTE_SCALE.length;
    }

    get name() {
        return NOTE_SCALE[this.indexInOctave].replace("_", this.octave.toString());
    }

    toString() {
        return this.name;
    }

    [Symbol.toPrimitive](hint: string) {
        if (hint === "number") {
            return this.index;
        }
        if (hint === "string") {
            return this.name;
        }
        return null;
    }
}
