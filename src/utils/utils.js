import { Sprite } from 'pixi.js';

const createSprite = ({ texture, position, anchor, rotation, alpha, width, height }) => {
    const sprite = Sprite.from(texture);
    position && sprite.position.set(...position);
    anchor && sprite.anchor.set(...anchor);
    rotation && (sprite.rotation = rotation);
    alpha && (sprite.alpha = alpha);
    width && (sprite.width = width);
    height && (sprite.height = height);

    return sprite;
};

export { createSprite };