import { Graphics, Container } from "pixi.js";
import { createSprite } from "../utils/utils";

export default class ProgressBar extends Container {
    constructor() {
        super();

        this.addChild(createSprite({ texture: 'progress_bg', anchor: [.5, .5]}));

        this.progressMask = this.addChild(new Graphics()
            .beginFill(0xff0000, 0.5)
            .drawRoundedRect(-345, 15, 683, 48, 24)
            .endFill());
        
        this.progressBar = this.addChild(createSprite({ texture: 'progress_bar', anchor: [1, .5]}));
        this.progressBar.position.set(-346, 40);

        this.progressBar.mask = this.progressMask;

        this.setProgress(0);
    }

    setProgress(progress) {
        if (progress > 1) progress = 1;
        this.progressBar.x = -346 + progress * 683;
    }
}