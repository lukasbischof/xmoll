import { render } from "preact";
import GameView from "./GameView";
import MainMenu from "./MainMenu";

export function App() {
    return (
        <main class="container main-container content-card-container">
            <div class="card-faces-container" id="content-card">
                <MainMenu />
                <GameView />
            </div>
        </main>
    );
}

render(<App />, document.body);
