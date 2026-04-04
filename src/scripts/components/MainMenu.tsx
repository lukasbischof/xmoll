interface Props {
    onFlipToGame: () => void;
}

export default function MainMenu({ onFlipToGame: _onFlipToGame }: Props) {
    return (
        <div id="main-menu-card-face" class="panel content-card card-face front-face">
            <div class="main-menu" data-controller="main-menu">
                <div class="logo-header">
                    <div class="logo">
                        <span class="bigger">X</span>
                        <span>moll</span>
                    </div>
                </div>

                <div class="main-menu-form pt-4">
                    <div class="mb-3 text-center w-100">Bitte wähle Deine Intervalle, die Du trainieren möchtest:</div>

                    <form
                        action="/"
                        data-main-menu-target="form"
                        data-action="main-menu#submit change->main-menu#change"
                    >
                        <div class="well mt-3">
                            <fieldset name="intervals" class="button-grid">
                                {/* Values in cents */}
                                <input id="prime" type="checkbox" hidden value="0" />
                                <label for="prime" class="selectable-button">
                                    Prim
                                </label>
                                <input id="second" type="checkbox" hidden value="100-200" />
                                <label for="second" class="selectable-button">
                                    Sekund
                                </label>
                                <input id="third" type="checkbox" hidden value="300-400" />
                                <label for="third" class="selectable-button">
                                    Terz
                                </label>
                                <input id="fourth" type="checkbox" hidden value="500-600" />
                                <label for="fourth" class="selectable-button">
                                    Quarte
                                </label>
                                <input id="fifth" type="checkbox" hidden value="700" />
                                <label for="fifth" class="selectable-button">
                                    Quinte
                                </label>
                                <input id="sixth" type="checkbox" hidden value="800-900" />
                                <label for="sixth" class="selectable-button">
                                    Sexte
                                </label>
                                <input id="seventh" type="checkbox" hidden value="1000-1100" />
                                <label for="seventh" class="selectable-button">
                                    Septime
                                </label>
                                <input id="octave" type="checkbox" hidden value="1200" />
                                <label for="octave" class="selectable-button">
                                    Oktave
                                </label>
                            </fieldset>
                        </div>

                        <div class="mb-3 mt-4 text-center w-100">Sowie die Anzahl Runden, die Du spielen möchtest:</div>

                        <div class="well mt-3">
                            <div class="button-grid small-grid">
                                <input id="ten" name="rounds" type="radio" hidden value="10" />
                                <label for="ten" class="selectable-button">
                                    10
                                </label>
                                <input id="twenty" name="rounds" type="radio" hidden value="20" />
                                <label for="twenty" class="selectable-button">
                                    20
                                </label>
                                <input id="thirty" name="rounds" type="radio" hidden value="30" />
                                <label for="thirty" class="selectable-button">
                                    30
                                </label>
                                <input id="infinity" name="rounds" type="radio" hidden value="Infinity" defaultChecked />
                                <label for="infinity" class="selectable-button">
                                    &infin;
                                </label>
                            </div>
                        </div>

                        <div class="mt-4">
                            <div class="d-flex align-items-center" data-controller="switch-button">
                                <input
                                    type="checkbox"
                                    name="exam-mode"
                                    hidden
                                    id="exam-mode-checkbox"
                                    data-switch-button-target="checkbox"
                                />
                                <div class="switch-button" data-action="click->switch-button#toggle">
                                    <div class="rail">
                                        <div class="knob"></div>
                                    </div>
                                </div>
                                <label for="exam-mode-checkbox" class="switch-button ms-2">
                                    Prüfungsmodus
                                </label>
                                <span class="help-button ms-2" title="Im Prüfungsmodus wird die Antwort nicht angezeigt.">
                                    ?
                                </span>
                            </div>
                        </div>

                        <div class="mt-4 mb-2 w-100 d-flex justify-content-center">
                            <button
                                class="btn btn-primary"
                                type="submit"
                                data-main-menu-target="submitButton"
                                disabled
                            >
                                Training beginnen
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
