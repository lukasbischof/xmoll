import { Controller } from "@hotwired/stimulus";
import Game from "../Game.ts";

// noinspection JSUnusedGlobalSymbols
export class GameController extends Controller {
    static targets = ["logoHeader"];

    declare logoHeaderTarget: HTMLElement;

    playAgain() {
        this.logoHeaderTarget.classList.add("pending");
        Game.currentGame?.playCurrentInterval().then(() => this.logoHeaderTarget.classList.remove("pending"));
    }
}
