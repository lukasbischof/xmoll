import { Controller } from "@hotwired/stimulus";

// noinspection JSUnusedGlobalSymbols
export class MainMenuController extends Controller {
    static targets = ["form"];

    submit(event: Event) {
        event.preventDefault();
        console.log("Form submitted");

        document.getElementById("content-card")!.classList.add("rotated");
    }
}
