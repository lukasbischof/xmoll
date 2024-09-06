import { Controller } from "@hotwired/stimulus";
import type { SemitoneDistance } from "../AbsoluteInterval.ts";
import Game from "../Game.ts";

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
            .flatMap((element) => element.value.split("-").map((n) => Number.parseInt(n)))
            .filter((value) => !Number.isNaN(value)) as SemitoneDistance[];

        const rounds = Number.parseInt((form.elements.namedItem("rounds") as RadioNodeList).value as string);
        const examMode = (form.elements.namedItem("exam-mode") as HTMLInputElement).checked;

        Game.startNewGame(selectedIntervals, rounds || Number.POSITIVE_INFINITY, examMode).then(() => {
            const contentCard = document.getElementById("content-card");
            contentCard?.classList.add("rotated");

            const listener = (e: TransitionEvent) => {
                if (e.target !== contentCard) return;

                window.history.pushState({}, "", "#game");

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
