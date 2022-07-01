import { Button } from '.';

export default class TextButton extends Button {
    constructor(textures, text, textOffsetY) {
        super(textures);

        if (!text) return;

        this.addChild(text);
        text.anchor.set(.5, .5);

        if (!textOffsetY) return;

        text.position.y += textOffsetY;
    }
};