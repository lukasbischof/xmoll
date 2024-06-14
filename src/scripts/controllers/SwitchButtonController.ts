import { Controller } from "@hotwired/stimulus";

export default class SwitchButtonController extends Controller {
    static targets = ["checkbox"];

    declare checkboxTarget: HTMLInputElement;

    toggle() {
        this.checkboxTarget.checked = !this.checkboxTarget.checked;
    }
}
