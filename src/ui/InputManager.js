import { EventEmitter } from '@pixi/utils';
import inputs from "../config/inputs.json";

class InputManager extends EventEmitter {
    #pressedButtons = [];

    enable() {
        document.addEventListener('keydown', this.onKeyDown.bind(this), false);
		document.addEventListener('keyup', this.onKeyUp.bind(this), false);
    }

    disable() {
        document.removeEventListener('keydown', this.onKeyDown.bind(this), false);
		document.removeEventListener('keyup', this.onKeyUp.bind(this), false);
    }

    onKeyDown(event) {
        let input = inputs.find(input => input.keyCode === event.keyCode);
        if (!input) return;
        
        if (this.#pressedButtons.includes(input.keyCode)) {
            return;
        }

        this.#pressedButtons.push(input.keyCode);
        this.emit('action', input.name, true);
    }

    onKeyUp(event) {
        let input = inputs.find(input => input.keyCode === event.keyCode);
        if (!input) return;
        
        this.#pressedButtons = this.#pressedButtons.filter(btn => btn !== input.keyCode);
        this.emit('action', input.name, false);
    }
};

export default new InputManager;