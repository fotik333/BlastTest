import { Sprite } from 'pixi.js';

const createSprite = ({ texture, position, anchor, rotation, alpha, width, height, scale }) => {
    const sprite = Sprite.from(texture);
    position && sprite.position.set(...position);
    anchor && sprite.anchor.set(...anchor);
    scale && sprite.scale.set(...scale);
    rotation && (sprite.rotation = rotation);
    alpha && (sprite.alpha = alpha);
    width && (sprite.width = width);
    height && (sprite.height = height);

    return sprite;
};

export { createSprite };