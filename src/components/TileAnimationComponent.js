import Component from "../core/Component";
import { SpaceshipAttackComponent, DisplayObjectComponent } from ".";
import GameWorld from "../core/GameWorld";
import Game from "../Game";
import { Tween, Easing } from "@tweenjs/tween.js";

const offsetX = 170;
const offsetY = 210;

class TileAnimationComponent extends Component {
    #transform;
    #displayObject;
    #animation;

    constructor(screen, layout) {
        super();

        this.col = 0;
        this.row = 0;
    }

    onAwake() {
        this.#transform = this.gameObject.transform;
        this.#displayObject = this.gameObject.getComponent(DisplayObjectComponent).displayObject;
    }

    reset() {
        // this.#animation && this.#animation.stop();
        this.#transform.scale = { x: 1, y: 1 };
        this.#transform.rotation = 0;
    }

    swapReady() {
        let obj = { value: 1 };
        this.animation = new Tween(obj).to({ value: 1.1 }, 200).onUpdate(_ => this.#transform.scale = { x: obj.value, y: obj.value }).easing(Easing.Sinusoidal.In).repeat(Infinity).yoyo(true).start();
    }

    reject(cb) {
        // let obj = { value: 0 };
        // new Tween(obj).to({ value: 1 }, 200).onUpdate(_ => this.#transform.rotation = obj.value * Math.PI * 2).easing(Easing.Sinusoidal.InOut).start();

        // this.reset();

        let obj = { value: 1 };
        new Tween(obj).to({ value: 1.1 }, 100).onUpdate(_ => this.#transform.scale = { x: obj.value, y: obj.value }).easing(Easing.Sinusoidal.In).repeat(1).yoyo(true).start();
    }

    burn(cb) {
        this.animation && this.animation.stop();
        // this.reset();

        let obj = { value: 1 };
        new Tween(obj).to({ value: 0 }, 100).onUpdate(_ => this.#transform.scale = { x: obj.value, y: obj.value }).easing(Easing.Back.In).start();
    }

    fallTo(col, row, cb) {
        this.animation && this.animation.stop();
        // this.reset();

        this.#transform.position = { x: col * offsetX, row: (row - 10) * offsetY };

        let obj = { value: 0 };

        new Tween(obj).to({ value: 1 }, 200).easing(Easing.Sinusoidal.Out).onUpdate(_ => this.#transform.position = {
            x: col * offsetX,
            y: (row - 10) * offsetY + (row * offsetY - (row - 10) * offsetY) * obj.value,
        }).onStart(_ => this.reset()).start();
    }

    moveTo(col, row, cb) {
        this.animation && this.animation.stop();
        this.reset();

        let currentPosition = this.#transform.position;
        let obj = { value: 0 };

        new Tween(obj).to({ value: 1 }, 200).onUpdate(_ => this.#transform.position = {
            x: currentPosition.x + (col * offsetX - currentPosition.x) * obj.value,
            y: currentPosition.y + (row * offsetY - currentPosition.y) * obj.value,
        }).start();
    }

    setPosition(col, row) {
        this.#transform.position = { x: col * offsetX, y: row * offsetY };

        this.col = col;
        this.row = row;
    }

    setType(type) {
        this.type = type;
        this.#displayObject.tint = Game.colors[type];
    }
}

export default TileAnimationComponent;