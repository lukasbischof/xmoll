import { describe, it, expect } from "bun:test";
import Note, { type NoteString } from "./Note.ts";

describe("Note", () => {
    describe("fromString", () => {
        it("should create a Note from a valid NoteString", () => {
            const note: NoteString = "C#4";
            const result = Note.fromString(note);
            expect(result.index).toEqual(4 * 12 + 1);
        });

        it("should throw an error for an invalid note format", () => {
            const note: NoteString = "Z#4" as NoteString;
            expect(() => Note.fromString(note)).toThrow("Invalid note format");
        });

        it("should throw an error for a note not in the NOTE_SCALE", () => {
            const note: NoteString = "H#4" as NoteString;
            expect(() => Note.fromString(note)).toThrow("Invalid note");
        });

        it("should handle notes without a sharp", () => {
            const note: NoteString = "H4";
            const result = Note.fromString(note);
            expect(result.index).toEqual(4 * 12 + 11);
        });

        it("should handle notes in different octaves", () => {
            const note: NoteString = "C5";
            const result = Note.fromString(note);
            expect(result.index).toEqual(5 * 12);
        });

        it("should throw an error with an invalid octave", () => {
            const note = "C#Z" as NoteString;
            expect(() => Note.fromString(note)).toThrow("Invalid note format");
        });
    });

    describe("getters", () => {
        it("should return the correct information", () => {
            const note = new Note(6 * 12 + 3);
            expect(note.octave).toEqual(6);
            expect(note.indexInOctave).toEqual(3);
            expect(note.name).toEqual("D#6");
        });
    });

    describe("comparisons", () => {
        it("should compare notes correctly", () => {
            const lowerNote = new Note(6 * 12 + 3);
            const higherNote = new Note(6 * 12 + 4);

            expect(lowerNote < higherNote).toBe(true);
            expect(lowerNote > higherNote).toBe(false);
        });
    });
});
