import { Application } from "@hotwired/stimulus";

import { MainMenuController } from "./controllers/MainMenuController";
import { GameController } from "./controllers/GameController.ts";

window.Stimulus = Application.start();
Stimulus.register("main-menu", MainMenuController);
Stimulus.register("game", GameController);

declare global {
    interface Window {
        Stimulus: Application;
    }

    const Stimulus: Application;
}
