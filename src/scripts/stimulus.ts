import { Application } from "@hotwired/stimulus";

import { GameController } from "./controllers/GameController.ts";
import { MainMenuController } from "./controllers/MainMenuController";

window.Stimulus = Application.start();
window.Stimulus.register("main-menu", MainMenuController);
window.Stimulus.register("game", GameController);

declare global {
    interface Window {
        Stimulus: Application;
    }

    const Stimulus: Application;
}
