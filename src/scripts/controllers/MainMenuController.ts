import { Controller } from "@hotwired/stimulus";
import Game, { type Interval } from "../Game.ts";

// noinspection JSUnusedGlobalSymbols
export class MainMenuController extends Controller {
    static targets = ["form", "submitButton"];

    declare formTarget: HTMLFormElement;
    declare submitButtonTarget: HTMLButtonElement;

    submit(event: SubmitEvent) {
        event.preventDefault();

        const form = event.target as HTMLFormElement;
        const intervalsFieldset = form.elements.namedItem("intervals") as HTMLFieldSetElement;
        const selectedIntervals = (Array.from(intervalsFieldset.elements) as HTMLInputElement[])
            .filter((element) => element.checked)
            .map((element) => Number.parseInt(element.value) as Interval);

        Game.startNewGame(selectedIntervals).then(() => {
            const contentCard = document.getElementById("content-card");
            contentCard?.classList.add("rotated");

            const listener = (e: TransitionEvent) => {
                if (e.target !== contentCard) return;

                window.history.pushState({}, "", `#game?intervals=${selectedIntervals.join(",")}`);

                setTimeout(() => Game.currentGame?.transitionToNextInterval(), 500);
                contentCard?.removeEventListener("transitionend", listener, false);
            };
            contentCard?.addEventListener("transitionend", listener, false);
        });
    }

    change() {
        const intervalsFieldset = this.formTarget.elements.namedItem("intervals") as HTMLFieldSetElement;
        const intervalCheckboxes = Array.from(intervalsFieldset.elements) as HTMLInputElement[];

        if (intervalCheckboxes.some((e) => e.checked)) {
            this.submitButtonTarget.removeAttribute("disabled");
        } else {
            this.submitButtonTarget.setAttribute("disabled", "");
        }
    }
}
