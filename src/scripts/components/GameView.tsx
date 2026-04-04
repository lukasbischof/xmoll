import { useRef, useState } from "preact/hooks";
import type { SemitoneDistance } from "../AbsoluteInterval";
import Game from "../Game";
import { debug } from "../logger";

type TileState = "success" | "failure" | "unknown";

export default function GameView() {
    const [progressTiles, setProgressTiles] = useState<TileState[]>([]);
    const logoRef = useRef<HTMLDivElement>(null);
    const fieldsetRef = useRef<HTMLFieldSetElement>(null);

    const applyLogoStatus = (status: "success" | "failure" | "pending" | null) => {
        const logo = logoRef.current;
        if (!logo) return;
        logo.classList.remove("success", "failure", "pending");
        if (status) logo.classList.add(status);
    };

    const clearSelection = () => {
        if (!fieldsetRef.current) return;
        for (const el of Array.from(fieldsetRef.current.elements) as HTMLInputElement[]) {
            el.checked = false;
        }
    };

    const handlePlayAgain = () => {
        applyLogoStatus("pending");
        Game.currentGame?.playCurrentInterval().then(() => applyLogoStatus(null));
    };

    const handleIntervalChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (!target.checked) return;

        applyLogoStatus(null);

        const selectedInterval = Number.parseInt(target.value) as SemitoneDistance;
        const correct = Game.currentGame.provideAnswer(selectedInterval);
        const currentInterval =
            Game.currentGame.state.playedIntervals[Game.currentGame.state.playedIntervals.length - 1];
        debug(`Selected interval: ${selectedInterval}, Correct: ${correct}, current interval: ${currentInterval}`);

        const examMode = Game.currentGame.state.config.examMode;
        if (examMode) {
            setProgressTiles((prev) => [...prev, "unknown"]);
            clearSelection();
            Game.currentGame.transitionToNextInterval();
        } else {
            if (correct) {
                applyLogoStatus("success");
                setProgressTiles((prev) => [...prev, "success"]);
            } else {
                applyLogoStatus("failure");
                setProgressTiles((prev) => [...prev, "failure"]);
            }

            const logo = logoRef.current;
            if (!logo) return;

            const listener = () => {
                applyLogoStatus(null);
                logo.removeEventListener("animationend", listener);
                clearSelection();
                Game.currentGame.transitionToNextInterval();
            };
            logo.addEventListener("animationend", listener);
        }
    };

    const rounds = Game.currentGame?.state.config.rounds;
    const gridColumns =
        progressTiles.length > 0 && Number.isFinite(rounds)
            ? `repeat(${rounds}, 1fr)`
            : "repeat(auto-fit, minmax(1px, 1fr))";

    return (
        <div id="game-card-face" class="panel content-card card-face back-face">
            <div class="logo-header" ref={logoRef}>
                <div class="logo align-items-center">
                    <div class="piano" />
                    <div class="d-inline-flex align-items-baseline">
                        <span class="bigger">X</span>
                        <span>moll</span>
                    </div>
                </div>
            </div>
            <div class="main-menu-form pt-4">
                <div class="mb-4 text-center w-100">Welches Intervall wurde gespielt?</div>

                <form action="/" onChange={handleIntervalChange}>
                    <div class="well mt-3">
                        <fieldset class="button-grid" ref={fieldsetRef}>
                            {/* Values in cents */}
                            <input id="g_prime" type="radio" name="game-interval" hidden value="0" />
                            <label for="g_prime" class="selectable-button color-1">
                                Prim
                            </label>
                            <input id="g_minor_second" type="radio" name="game-interval" hidden value="100" />
                            <label for="g_minor_second" class="selectable-button color-2">
                                kleine Sekunde
                            </label>
                            <input id="g_major_second" type="radio" name="game-interval" hidden value="200" />
                            <label for="g_major_second" class="selectable-button color-2">
                                grosse Sekunde
                            </label>
                            <input id="g_minor_third" type="radio" name="game-interval" hidden value="300" />
                            <label for="g_minor_third" class="selectable-button color-3">
                                kleine Terz
                            </label>
                            <input id="g_major_third" type="radio" name="game-interval" hidden value="400" />
                            <label for="g_major_third" class="selectable-button color-3">
                                grosse Terz
                            </label>
                            <input id="g_perfect_fourth" type="radio" name="game-interval" hidden value="500" />
                            <label for="g_perfect_fourth" class="selectable-button color-4">
                                (reine) Quarte
                            </label>
                            <input id="g_augmented_fourth" type="radio" name="game-interval" hidden value="600" />
                            <label
                                for="g_augmented_fourth"
                                class="selectable-button color-4"
                                title="übermässige Quarte / verminderte Quinte"
                            >
                                Übermässige Quarte
                            </label>
                            <input id="g_fifth" type="radio" name="game-interval" hidden value="700" />
                            <label for="g_fifth" class="selectable-button color-5">
                                (reine) Quinte
                            </label>
                            <input id="g_minor_sixth" type="radio" name="game-interval" hidden value="800" />
                            <label for="g_minor_sixth" class="selectable-button color-6">
                                kleine Sexte
                            </label>
                            <input id="g_major_sixth" type="radio" name="game-interval" hidden value="900" />
                            <label for="g_major_sixth" class="selectable-button color-6">
                                grosse Sexte
                            </label>
                            <input id="g_minor_seventh" type="radio" name="game-interval" hidden value="1000" />
                            <label for="g_minor_seventh" class="selectable-button color-7">
                                kleine Septime
                            </label>
                            <input id="g_major_seventh" type="radio" name="game-interval" hidden value="1100" />
                            <label for="g_major_seventh" class="selectable-button color-7">
                                grosse Septime
                            </label>
                            <input id="g_octave" type="radio" name="game-interval" hidden value="1200" />
                            <label for="g_octave" class="selectable-button color-8">
                                Oktave
                            </label>
                        </fieldset>
                    </div>
                </form>

                <div class="mt-4 w-100 d-flex justify-content-center">
                    <button class="btn btn-primary" onClick={handlePlayAgain}>
                        Erneut abspielen
                    </button>
                </div>
            </div>
            <div class="footer mt-2">
                <div class="progress-bar" style={{ gridTemplateColumns: gridColumns }}>
                    {progressTiles.map((state, i) => (
                        <div key={i} class={`tile ${state}`} />
                    ))}
                </div>
            </div>
        </div>
    );
}
