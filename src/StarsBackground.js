import { WIDTH, HEIGHT } from './config/layout';
import { Container, Ticker } from 'pixi.js';
import Pool from './utils/Pool';
import { createSprite } from './utils/utils.js';

const STARS_COUNT = 100;

const TYPES = [
	{
		speed: 0.2,
		size: 30
	},
	{
		speed: 0.5,
		size: 60
	},
	{
		speed: 2,
		size: 100
	}
];

class StarsBackground extends Container {
	constructor() {
		super();

		this.starsPool = new Pool(this._createStar.bind(this), STARS_COUNT);

		Ticker.shared.add(this._tick, this);
	}

	_tick() {
		this.starsPool.elements.forEach(star => {
			star.position.y += star.speed;

			if (star.position.y - star.height > HEIGHT) {
				star.position.y = -star.height;
				star.position.x = Math.random() * WIDTH;
			}
		});
	}

	_createStar() {
		const type = Math.floor(Math.random() * TYPES.length);
		const size = TYPES[type].size;
		const star = this.addChild(createSprite({ texture: 'star', position: [Math.random() * WIDTH, Math.random() * HEIGHT],
			anchor: [.5, .5], rotation: Math.random() * 2 * Math.PI, alpha: 0.8, width: size, height: size }));
		
		star.speed = TYPES[type].speed;

		return star;
	}

	destroy() {
		Ticker.shared.remove(this.tick, this);
        this.starsPool.elements.forEach(star => star.destroy());
        this.starsPool.clear();
        
        super.destroy();
	}
}

export default StarsBackground;