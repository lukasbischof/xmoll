import { render } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import Game from "../Game";
import { debug } from "../logger";
import GameView from "./GameView";
import MainMenu from "./MainMenu";

/** Delay in ms to trigger a reflow so the no-animation class takes effect before removal. */
const REFLOW_DELAY_MS = 10;
/** Duration in ms to wait after the card-flip transition before starting the first interval. */
const POST_FLIP_START_DELAY_MS = 500;

let restoredFromHash = false;
if (window.location.hash.startsWith("#game")) {
    debug("Game page loaded");
    try {
        Game.restore();
        restoredFromHash = true;
    } catch (e) {
        console.error(e);
        window.location.hash = "";
    }
}

export function App() {
    const [isFlipped, setIsFlipped] = useState(restoredFromHash);
    const [noAnimation, setNoAnimation] = useState(restoredFromHash);
    const cardRef = useRef<HTMLDivElement>(null);

    // biome-ignore lint/correctness/useExhaustiveDependencies: only run on mount to remove no-animation after initial render
    useEffect(() => {
        if (noAnimation) {
            setTimeout(() => setNoAnimation(false), REFLOW_DELAY_MS);
        }
    }, []);

    const handleFlipToGame = () => {
        setIsFlipped(true);

        const card = cardRef.current;
        if (!card) return;

        const listener = (e: TransitionEvent) => {
            if (e.target !== card) return;

            window.history.pushState({}, "", "#game");
            setTimeout(() => Game.currentGame?.transitionToNextInterval(), POST_FLIP_START_DELAY_MS);
            card.removeEventListener("transitionend", listener, false);
        };
        card.addEventListener("transitionend", listener, false);
    };

    return (
        <main class="container main-container content-card-container">
            <div
                ref={cardRef}
                class={`card-faces-container${isFlipped ? " rotated" : ""}${noAnimation ? " no-animation" : ""}`}
                id="content-card"
            >
                <MainMenu onFlipToGame={handleFlipToGame} />
                <GameView />
            </div>
        </main>
    );
}

render(<App />, document.body);
