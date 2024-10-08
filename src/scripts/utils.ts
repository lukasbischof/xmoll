import AbsoluteInterval, { type SemitoneDistance } from "./AbsoluteInterval.ts";
import Note from "./Note.ts";
import type { Source } from "./Source.ts";
import { debug } from "./logger.ts";

export const playSound = (audioBuffer: AudioBuffer, audioContext: AudioContext, onended?: () => void) => {
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);

    if (onended) source.onended = onended;

    source.start();
};

export const selectRandomIntervalFromSource = (
    source: Source,
    selectedIntervals: SemitoneDistance[]
): AbsoluteInterval => {
    const notesRange = Object.keys(source).map(Number);
    const currentInterval = selectedIntervals[Math.floor(Math.random() * selectedIntervals.length)] / 100;
    const lowerIndex = notesRange[Math.floor(Math.random() * (notesRange.length - currentInterval))];
    const higherIndex = lowerIndex + currentInterval;

    debug(`Selected interval: ${new Note(lowerIndex)} - ${new Note(higherIndex)}`);

    return new AbsoluteInterval(new Note(lowerIndex), new Note(higherIndex));
};
