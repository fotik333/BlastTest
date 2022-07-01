import { Button } from '.';
import { createSprite } from '../utils/utils';

export default class CheckBox extends Button {
    constructor(textures, checkTexture, checkOffsetY) {
        super(textures);

        this.checked = false;

        this.check = this.addChild(createSprite({ texture: checkTexture, anchor: [.5]}));
        this.check.visible = false;

        this.on('pressed', this.onPressed, this);

        if (!checkOffsetY) return;

        this.check.position.y += checkOffsetY;
    }

    onPressed() {
        this.checked = !this.checked;
        this.check.visible = this.checked;
    }
};