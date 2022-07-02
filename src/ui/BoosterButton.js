import { TextButton } from '.';
import { Tween, Easing } from "@tweenjs/tween.js";

export default class BoosterButton extends TextButton {
    #count;
    #active;

    constructor(textures, text, textOffsetY, countText, countTextOffsetY) {
        super(textures, text, textOffsetY);

        if (!countText) return;

        this.addChild(countText);
        countText.anchor.set(.5, .5);

        if (!countTextOffsetY) return;

        countText.position.y += countTextOffsetY;

        this._countText = countText;
    }

    setCount(count) {
        this.#count = count;
        this._countText.text = count;
    }

    decreaseCount() {
        this.#count--;
        this._countText.text = this.#count;

        if (this.#count <= 0) this.interactive = false;
    }

    getCount() {
        return this.#count;
    }

    getActive() {
        return this.#active;
    }

    switchActive() {
        this.setActive(!this.#active);
    }

    boosterUsed() {
        this.setActive(false);
        this.decreaseCount();
    }

    setActive(active) {
        this.#active = active;

        if (active) {
            this.tween = new Tween(this.scale).to({ x: 1.1, y: 1.1 }, 200).yoyo(true).repeat(Infinity).start();
        } else {
            this.tween && this.tween.stop();
            this.scale.set(1, 1);
        }
    }
};