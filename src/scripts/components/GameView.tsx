export default function GameView() {
    return (
        <div id="game-card-face" class="panel content-card card-face back-face" data-controller="game">
            <div class="logo-header" data-game-target="logoHeader">
                <div class="logo align-items-center">
                    <div class="piano"></div>
                    <div class="d-inline-flex align-items-baseline">
                        <span class="bigger">X</span>
                        <span>moll</span>
                    </div>
                </div>
            </div>
            <div class="main-menu-form pt-4">
                <div class="mb-4 text-center w-100">Welches Intervall wurde gespielt?</div>

                <form action="/" data-action="change->game#selectedInterval" data-game-target="intervalForm">
                    <div class="well mt-3">
                        <fieldset class="button-grid" data-game-target="buttonGridFieldset">
                            {/* Values in cents */}
                            <input id="g_prime" type="radio" name="game-interval" hidden value="0" />
                            <label for="g_prime" class="selectable-button color-1">
                                Prim
                            </label>
                            <input id="g_minor_second" type="radio" name="game-interval" hidden value="100" />
                            <label for="g_minor_second" class="selectable-button color-2">
                                kleine Sekunde
                            </label>
                            <input id="g_major_second" type="radio" name="game-interval" hidden value="200" />
                            <label for="g_major_second" class="selectable-button color-2">
                                grosse Sekunde
                            </label>
                            <input id="g_minor_third" type="radio" name="game-interval" hidden value="300" />
                            <label for="g_minor_third" class="selectable-button color-3">
                                kleine Terz
                            </label>
                            <input id="g_major_third" type="radio" name="game-interval" hidden value="400" />
                            <label for="g_major_third" class="selectable-button color-3">
                                grosse Terz
                            </label>
                            <input id="g_perfect_fourth" type="radio" name="game-interval" hidden value="500" />
                            <label for="g_perfect_fourth" class="selectable-button color-4">
                                (reine) Quarte
                            </label>
                            <input id="g_augmented_fourth" type="radio" name="game-interval" hidden value="600" />
                            <label
                                for="g_augmented_fourth"
                                class="selectable-button color-4"
                                title="übermässige Quarte / verminderte Quinte"
                            >
                                Übermässige Quarte
                            </label>
                            <input id="g_fifth" type="radio" name="game-interval" hidden value="700" />
                            <label for="g_fifth" class="selectable-button color-5">
                                (reine) Quinte
                            </label>
                            <input id="g_minor_sixth" type="radio" name="game-interval" hidden value="800" />
                            <label for="g_minor_sixth" class="selectable-button color-6">
                                kleine Sexte
                            </label>
                            <input id="g_major_sixth" type="radio" name="game-interval" hidden value="900" />
                            <label for="g_major_sixth" class="selectable-button color-6">
                                grosse Sexte
                            </label>
                            <input id="g_minor_seventh" type="radio" name="game-interval" hidden value="1000" />
                            <label for="g_minor_seventh" class="selectable-button color-7">
                                kleine Septime
                            </label>
                            <input id="g_major_seventh" type="radio" name="game-interval" hidden value="1100" />
                            <label for="g_major_seventh" class="selectable-button color-7">
                                grosse Septime
                            </label>
                            <input id="g_octave" type="radio" name="game-interval" hidden value="1200" />
                            <label for="g_octave" class="selectable-button color-8">
                                Oktave
                            </label>
                        </fieldset>
                    </div>
                </form>

                <div class="mt-4 w-100 d-flex justify-content-center">
                    <button class="btn btn-primary" data-action="game#playAgain">
                        Erneut abspielen
                    </button>
                </div>
            </div>
            <div class="footer mt-2">
                <div
                    class="progress-bar"
                    style="grid-template-columns: repeat(auto-fit, minmax(1px, 1fr));"
                    data-game-target="progressBar"
                ></div>
            </div>
        </div>
    );
}
