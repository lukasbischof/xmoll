import { render } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import Game from "../Game";
import GameView from "./GameView";
import MainMenu from "./MainMenu";

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
                setTimeout(() => cardRef.current?.classList.remove("no-animation"), 10);
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
            setTimeout(() => Game.currentGame?.transitionToNextInterval(), 500);
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
