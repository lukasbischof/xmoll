import { render } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import Game from "../Game";
import GameView from "./GameView";
import MainMenu from "./MainMenu";

/** Delay in ms to trigger a reflow so the no-animation class takes effect before removal. */
const REFLOW_DELAY_MS = 10;
/** Duration in ms to wait after the card-flip transition before starting the first interval. */
const POST_FLIP_START_DELAY_MS = 500;

export function App() {
    const [isFlipped, setIsFlipped] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (window.location.hash.startsWith("#game")) {
            console.log("Game page loaded");

            try {
                Game.restore();
                setIsFlipped(true);
                cardRef.current?.classList.add("no-animation");
                setTimeout(() => cardRef.current?.classList.remove("no-animation"), REFLOW_DELAY_MS);
            } catch (e) {
                console.error(e);
                window.location.hash = "";
            }
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
            <div ref={cardRef} class={`card-faces-container${isFlipped ? " rotated" : ""}`} id="content-card">
                <MainMenu onFlipToGame={handleFlipToGame} />
                <GameView />
            </div>
        </main>
    );
}

render(<App />, document.body);
