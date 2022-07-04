import { Container, Graphics } from 'pixi.js';
import { HEIGHT, WIDTH } from '../config/layout';
import { Tween, Easing } from "@tweenjs/tween.js";

class SceneTransition extends Container {
    #fade;

    constructor() {
        super();

        this.#fade = this.addChild(new Graphics()
            .beginFill(0x000000)
            .drawRect(0, 0, WIDTH, HEIGHT)
            .endFill()
        );

        this.#fade.interactive = true;
        this.#fade.visible = false;
    }

    transit(cb, instant) {
        if (instant) {
            cb && cb();
            return;
        }

        this.#fade.visible = true;
        this.#fade.alpha = 0;

        new Tween(this.#fade).to({ alpha: 1 }, 200).start().onComplete(_ => {
            cb && cb();
            new Tween(this.#fade).to({ alpha: 0 }, 200).start().onComplete(_ => this.#fade.visible = false);
        });
    }
}

export default SceneTransition;