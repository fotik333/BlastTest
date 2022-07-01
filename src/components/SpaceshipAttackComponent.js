import Component from "../core/Component";
import InputManager from "../ui/InputManager";
import GameObjectPool from "../utils/GameObjectPool";
import gameConfig from '../config/gameConfig.json';

class SpaceshipAttackComponent extends Component {
    #offsetY = 0;
    #amount = 0;
    #rocketsCount;
    #asteroidsDestroyed = 0;

    constructor(createRocketFunc, amount, offsetY) {
        super();
        
        this.createRocketFunc = createRocketFunc;
        this.#amount = amount;
        this.#offsetY = offsetY;
    }

    get asteroidsDestroyed() {
        return this.#asteroidsDestroyed;
    }

    get rocketsCount() {
        return this.#rocketsCount;
    }

    onAwake() {
        this.rocketsPool = new GameObjectPool(this.createRocketFunc, this.#amount);
        this.#rocketsCount = gameConfig.rocketsCount;
    }

    onEnable() {
        InputManager.on('action', this.onInputAction, this);
    }

    onDisable() {
        InputManager.off('action', this.onInputAction, this);
    }

    onInputAction(action, isDown) {
		if (action === 'SHOT' && isDown) this.shoot();
    }

	shoot() {
        let rocket = this.rocketsPool.getNext();
        rocket.transform.position = { x: this.gameObject.transform.position.x, y: this.gameObject.transform.position.y + this.#offsetY };

        this.#rocketsCount--;
        this.emit('SHOT');
	}

    onAsteroidDestroyed() {
        this.#asteroidsDestroyed++;
    }

    onDestroy() {
        this.rocketsPool.clear();
    }
}

export default SpaceshipAttackComponent;