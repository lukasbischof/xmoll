import { Application } from "@hotwired/stimulus";

import { MainMenuController } from "./controllers/MainMenuController";

window.Stimulus = Application.start();
Stimulus.register("main-menu", MainMenuController);

declare global {
    interface Window {
        Stimulus: Application;
    }

    const Stimulus: Application;
}
