import { Sprite, Texture } from 'pixi.js';

export default class Button extends Sprite {
    constructor(textures) {
        if (!textures || !textures.normal) console.error(`Textures object should have at least 'normal' property`);

        super(Texture.from(textures.normal));

        this.buttonMode = true;
        this.interactive = true;
        this.pressed = false;
        this.over = false;

        this.normalTexture = Texture.from(textures.normal);
        this.hoverTexture = Texture.from(textures.hover || textures.normal);
        this.pressedTexture = Texture.from(textures.pressed || textures.normal);
        this.disabledTexture = Texture.from(textures.disabled || textures.normal);

        this
            .on('pointerdown', this.onDown, this)
            .on('pointerup', this.onUp, this)
            .on('pointerupoutside', this.onUp, this)
            .on('pointerover', this.onOver, this)
            .on('pointerout', this.onOut, this);
    }

    onDown() {
        this.pressed = true;
        this.texture = this.pressedTexture;
    }

    onUp() {
        if (this.pressed) {
            this.emit('pressed');
        }

        this.pressed = false;

        if (this.over) {
            this.texture = this.hoverTexture;
        } else {
            this.texture = this.normalTexture;
        }
    }

    onOver() {
        this.over = true;
        this.texture = this.hoverTexture;
    }

    onOut() {
        this.over = false;
        this.texture = this.normalTexture;
    }
};