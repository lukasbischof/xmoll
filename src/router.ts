import Game from "./scripts/Game.ts";

window.addEventListener("DOMContentLoaded", () => {
    if (window.location.hash.startsWith("#game")) {
        console.log("Game page loaded");

        try {
            Game.restore();
            const contentCard = document.getElementById("content-card");
            contentCard?.classList.add("rotated", "no-animation");

            setTimeout(() => contentCard?.classList.remove("no-animation"), 10);
        } catch (e) {
            console.error(e);
            window.location.hash = "";
        }
    }
});
