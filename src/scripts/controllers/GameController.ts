import { Controller } from "@hotwired/stimulus";
import Game from "../Game.ts";
import type { SemitoneDistance } from "../GameState.ts";
import { debug } from "../logger.ts";

// noinspection JSUnusedGlobalSymbols
export class GameController extends Controller {
    static targets = ["logoHeader", "intervalForm", "buttonGridFieldset", "progressBar"];

    declare logoHeaderTarget: HTMLElement;
    declare intervalFormTarget: HTMLFormElement;
    declare buttonGridFieldsetTarget: HTMLFieldSetElement;
    declare progressBarTarget: HTMLElement;

    playAgain() {
        this.logoHeaderTarget.classList.add("pending");
        Game.currentGame?.playCurrentInterval().then(() => this.logoHeaderTarget.classList.remove("pending"));
    }

    selectedInterval() {
        this.logoHeaderTarget.classList.remove("success", "failure", "pending");
        const selectedInterval = this.getSelectedInterval();
        if (selectedInterval === null) return;

        const correct = Game.currentGame.provideAnswer(selectedInterval);
        const currentInterval =
            Game.currentGame.state.playedIntervals[Game.currentGame.state.playedIntervals.length - 1];
        debug(`Selected interval: ${selectedInterval}, Correct: ${correct}, current interval: ${currentInterval}`);
        if (Game.currentGame.state.config.examMode) {
            this.addProgressBarTile("unknown");
        } else {
            if (correct) {
                this.logoHeaderTarget.classList.add("success");
                this.addProgressBarTile("success");
            } else {
                this.logoHeaderTarget.classList.add("failure");
                this.addProgressBarTile("failure");
            }
        }

        this.appendAnimationEndedListenerToLogo(() => {
            this.deselectAllIntervals();
            Game.currentGame.transitionToNextInterval();
        });
    }

    private deselectAllIntervals() {
        for (const element of Array.from(this.buttonGridFieldsetTarget.elements) as HTMLInputElement[]) {
            element.checked = false;
        }
    }

    private addProgressBarTile(state: "success" | "failure" | "unknown") {
        if (this.progressBarTarget.childElementCount === 0 && Number.isFinite(Game.currentGame.state.config.rounds)) {
            this.progressBarTarget.style.gridTemplateColumns = `repeat(${Game.currentGame.state.config.rounds}, 1fr)`;
        }

        const tile = document.createElement("div");
        tile.classList.add("tile", state);
        this.progressBarTarget.appendChild(tile);
    }

    private appendAnimationEndedListenerToLogo(onEnded?: () => void) {
        const listener = () => {
            this.logoHeaderTarget.classList.remove("success", "failure");
            this.logoHeaderTarget.removeEventListener("animationend", listener);

            if (onEnded) onEnded();
        };
        this.logoHeaderTarget.addEventListener("animationend", listener);
    }

    private getSelectedInterval(): SemitoneDistance | null {
        const selected = (Array.from(this.buttonGridFieldsetTarget.elements) as HTMLInputElement[]).find(
            (element) => element.checked
        )?.value;

        return selected ? (Number.parseInt(selected) as SemitoneDistance) : null;
    }
}
