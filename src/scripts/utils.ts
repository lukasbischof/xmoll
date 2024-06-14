import Game, { type Interval, type SemitoneDistance } from "./Game.ts";
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

export const selectRandomIntervalFromSource = (source: Source, selectedIntervals: SemitoneDistance[]): Interval => {
    const notesRange = Object.keys(source).map(Number);
    const currentInterval = selectedIntervals[Math.floor(Math.random() * selectedIntervals.length)];
    const lowerIndex = notesRange[Math.floor(Math.random() * (notesRange.length - currentInterval))];
    const higherIndex = lowerIndex + currentInterval;

    debug(`Selected interval: ${new Note(lowerIndex)} - ${new Note(higherIndex)}`);

    return [new Note(lowerIndex), new Note(higherIndex)];
};

export const saveGame = (game: Game) => {
    const json = gameToJson(game);

    localStorage.setItem("game", JSON.stringify(json));
};

export const restoreGame = () => {
    const json = localStorage.getItem("game");
    if (!json) {
        throw new Error("Game not found in local storage");
    }

    window.currentGame = gameFromJson(JSON.parse(json));
};

function gameToJson(game: Game) {
    return {
        currentNotes: game.currentInterval.map((note) => note.index),
        config: {
            selectedIntervals: game.config.selectedIntervals,
            rounds: Number.isFinite(game.config.rounds) ? game.config.rounds : "Infinity",
            examMode: game.config.examMode,
        },
    };
}

const gameFromJson = (json: ReturnType<typeof gameToJson>) => {
    const { config } = json;
    const game = new Game({
        selectedIntervals: config.selectedIntervals,
        rounds: Number(config.rounds),
        examMode: config.examMode,
    });
    game.currentInterval = [new Note(json.currentNotes[0]), new Note(json.currentNotes[1])];
    return game;
};
