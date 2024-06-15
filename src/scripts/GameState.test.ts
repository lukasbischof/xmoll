import { describe, expect, it } from "bun:test";
import GameState, { type Config, type SemitoneDistance } from "./GameState.ts";
import Note from "./Note.ts";

describe("GameState", () => {
    describe("toJson", () => {
        it("should correctly serialize a GameState instance", () => {
            const config: Config = {
                selectedIntervals: [1 as SemitoneDistance, 2 as SemitoneDistance],
                rounds: 10,
                examMode: false,
            };
            const gameState = new GameState(config);
            gameState.pushInterval([new Note(0), new Note(1)]);
            gameState.pushInterval([new Note(1), new Note(2)]);

            const json = gameState.toJson();

            expect(json).toEqual({
                playedIntervals: [
                    [0, 1],
                    [1, 2],
                ],
                config: {
                    selectedIntervals: [1, 2],
                    rounds: 10,
                    examMode: false,
                },
            });
        });

        it("should handle infinite rounds", () => {
            const config: Config = {
                selectedIntervals: [1 as SemitoneDistance, 2 as SemitoneDistance],
                rounds: Number.POSITIVE_INFINITY,
                examMode: false,
            };
            const gameState = new GameState(config);

            const json = gameState.toJson();

            expect(json.config.rounds).toEqual("Infinity");
        });
    });

    describe("fromJson", () => {
        it("should correctly deserialize a GameState instance", () => {
            const json = {
                playedIntervals: [
                    [0, 1],
                    [4, 5],
                ],
                config: {
                    selectedIntervals: [1, 2] as SemitoneDistance[],
                    rounds: 10,
                    examMode: false,
                },
            };

            const gameState = GameState.fromJson(json);

            expect(gameState.playedIntervals).toEqual([
                [new Note(0), new Note(1)],
                [new Note(4), new Note(5)],
            ]);
            expect(gameState.config).toEqual({
                selectedIntervals: [1, 2],
                rounds: 10,
                examMode: false,
            });
        });

        it("should handle infinite rounds", () => {
            const json = {
                playedIntervals: [],
                config: {
                    selectedIntervals: [1, 2] as SemitoneDistance[],
                    rounds: "Infinity",
                    examMode: false,
                },
            };

            const gameState = GameState.fromJson(json);

            expect(gameState.config.rounds).toEqual(Number.POSITIVE_INFINITY);
        });
    });
});
