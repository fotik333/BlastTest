import Component from "../core/Component";
import { DisplayObjectComponent, GameFieldComponent } from ".";
import Game from "../Game";
import { Tween, Easing } from "@tweenjs/tween.js";
import GameSettings from "../GameSettings";
import { createSprite } from "../utils/utils";

let offsetX = 185;
let offsetY = 215;

class TileComponent extends Component {
    #transform;
    #displayObject;
    #animation;
    #arrow;

    constructor() {
        super();

        this.col = 0;
        this.row = 0;

        let tileSprite = createSprite({ texture: 'tile' });
        offsetX = tileSprite.width;
        offsetY = tileSprite.height;
    }

    onAwake() {
        this.#transform = this.gameObject.transform;
        this.#displayObject = this.gameObject.getComponent(DisplayObjectComponent).displayObject;

        this.#arrow = this.#displayObject.addChild(createSprite({ texture: 'arrow', anchor: [.5, .5], scale: [.8, .8], position: [0, 10] }));
        this.#arrow.visible = false;
    }

    superTile(type) {
        switch(type) {
            case GameFieldComponent.SUPERTILE_COL_TYPE:
                this.#arrow.rotation = 0;
                break;
            case GameFieldComponent.SUPERTILE_ROW_TYPE:
                this.#arrow.rotation = Math.PI / 2;
                break;
        }

        let obj = { value: 1 };

        this.#animation = new Tween(obj).to({ value: 2 }, 100)
            .onUpdate(_ => this.#transform.scale = { x: obj.value, y: obj.value })
            .onComplete(_ => {
                this.#arrow.visible = true;
                this.#animation = new Tween(obj).to({ value: 1 }, 100).onUpdate(_ => this.#transform.scale = { x: obj.value, y: obj.value }).start();
            })
            .start();
    }

    swapReady() {
        let obj = { value: 1 };
        this.#animation = new Tween(obj).to({ value: 1.1 }, 200).onUpdate(_ => this.#transform.scale = { x: obj.value, y: obj.value }).easing(Easing.Sinusoidal.In).repeat(Infinity).yoyo(true).start();
    }

    swapCancelled() {
        this.reset();
    }

    reject() {
        let obj = { value: 1 };
        new Tween(obj).to({ value: 1.1 }, 100).onUpdate(_ => this.#transform.scale = { x: obj.value, y: obj.value }).easing(Easing.Sinusoidal.In).repeat(1).yoyo(true).start();
    }

    burn() {
        this.#arrow.visible = false;
        this.reset();

        let obj = { value: 1 };
        new Tween(obj).to({ value: 0 }, 100).onUpdate(_ => this.#transform.scale = { x: obj.value, y: obj.value }).easing(Easing.Back.In).start();
    }

    fallTo(col, row) {
        this.#transform.position = { x: col * offsetX, row: (row - 10) * offsetY };

        let obj = { value: 0 };

        this.#animation = new Tween(obj).to({ value: 1 }, 200).easing(Easing.Sinusoidal.Out).onUpdate(_ => this.#transform.position = {
            x: col * offsetX,
            y: (row - 10) * offsetY + (row * offsetY - (row - 10) * offsetY) * obj.value,
        }).onStart(_ => {
            this.#transform.scale = { x: 1, y: 1 };
            this.#transform.rotation = 0;
        }).start();
    }

    moveTo(col, row) {
        this.#animation && this.#animation.stop();
        this.reset();

        let currentPosition = this.#transform.position;
        let obj = { value: 0 };

        this.#animation = new Tween(obj).to({ value: 1 }, 200).onUpdate(_ => this.#transform.position = {
            x: currentPosition.x + (col * offsetX - currentPosition.x) * obj.value,
            y: currentPosition.y + (row * offsetY - currentPosition.y) * obj.value,
        }).start();
    }

    setPosition(col, row) {
        this.#transform.position = { x: col * offsetX, y: row * offsetY };

        this.col = col;
        this.row = row;
    }

    reset() {
        this.#animation && this.#animation.stop();

        this.#transform.scale = { x: 1, y: 1 };
        this.#transform.rotation = 0;
    }

    setType(type) {
        this.type = type;
        this.#displayObject.tint = GameSettings.CurrentSettings.colors[type];
    }

    onDestroy() {
        this.#animation && this.#animation.stop();
    }
}

export default TileComponent;