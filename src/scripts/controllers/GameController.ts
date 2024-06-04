import { Controller } from "@hotwired/stimulus";
import Game from "../Game.ts";

// noinspection JSUnusedGlobalSymbols
export class GameController extends Controller {
    playAgain() {
        Game.currentGame?.playCurrentInterval();
    }
}
