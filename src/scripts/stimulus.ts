import { Application } from "@hotwired/stimulus";

import { GameController } from "./controllers/GameController.ts";
import { MainMenuController } from "./controllers/MainMenuController";
import SwitchButtonController from "./controllers/SwitchButtonController.ts";

window.Stimulus = Application.start();
window.Stimulus.register("main-menu", MainMenuController);
window.Stimulus.register("game", GameController);
window.Stimulus.register("switch-button", SwitchButtonController);

declare global {
    interface Window {
        Stimulus: Application;
    }

    const Stimulus: Application;
}
