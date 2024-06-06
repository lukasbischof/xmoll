import Note, { type NoteIndex } from "./Note.ts";
import type { Source } from "./Source.ts";

const LOWEST_GRAND_PIANO_NOTE = Note.fromString("C0");
const HIGHEST_GRAND_PIANO_NOTE = Note.fromString("C5");

export const loadGrandPianoSource = async (audioContext: AudioContext): Promise<Source> => {
    const audioFiles = [...Array(HIGHEST_GRAND_PIANO_NOTE.index - LOWEST_GRAND_PIANO_NOTE.index + 1).keys()].map(
        async (index) => {
            const fileName = `audio/grand-piano/${encodeURIComponent(
                new Note(LOWEST_GRAND_PIANO_NOTE.index + index).name
            )}.mp3`;
            const response = await fetch(fileName, { mode: "same-origin" });
            const arrayBuffer: ArrayBuffer = await response.arrayBuffer();
            return {
                index: LOWEST_GRAND_PIANO_NOTE.index + index,
                buffer: await audioContext.decodeAudioData(arrayBuffer),
            };
        }
    );

    return (await Promise.all(audioFiles)).reduce(
        (source: Source, { index, buffer }: { index: NoteIndex; buffer: AudioBuffer }) => {
            source[index] = buffer;
            return source;
        },
        {}
    );
};
