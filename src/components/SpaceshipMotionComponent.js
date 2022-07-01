import Component from "../core/Component";
import InputManager from "../ui/InputManager";
import { WIDTH } from '../config/layout';
import { DisplayObjectComponent } from ".";
import gameConfig from '../config/gameConfig.json';

class SpaceshipMotionComponent extends Component {
	#keysPressed = { right: false, left: false };
	#direction = 0;
	#transform;

	onAwake() {
		this.width = this.gameObject.getComponent(DisplayObjectComponent).displayObject.width;
		this.#transform = this.gameObject.transform;
	}

    onEnable() {
        InputManager.on('action', this.onInputAction, this);
    }

    onDisable() {
        InputManager.off('action', this.onInputAction, this);
    }

    onInputAction(action, isDown) {
        switch (action) {
            case 'RIGHT':
				this.setShipDirection(true, isDown);
                break;
            case 'LEFT':
				this.setShipDirection(false, isDown);
                break;
        }
    }

    tick(dt) {
		let x = this.#transform.position.x;
		let distance = gameConfig.shipSpeed * dt;
		
        if (this.#direction === -1) {
            if (this.#transform.position.x - this.width / 2 - gameConfig.margin > 0) {
                x -= distance;
            }
        } else if (this.#direction === 1) {
            if (this.#transform.position.x + this.width / 2 + gameConfig.margin < WIDTH) {
                x += distance;
            }
        }

		this.#transform.position = { x: x, y: this.#transform.position.y };
    }

	setShipDirection(isRight, isDown) {
		if (isRight) {
			if (isDown) {
				this.#keysPressed.right = true;
				this.#direction = 1;
			} else {
				this.#keysPressed.right = false;

				if (this.#keysPressed.left) {
					this.#direction = -1;
				} else {
					this.#direction = 0;
				}
			}
		} else {
			if (isDown) {
				this.#keysPressed.left = true;
				this.#direction = -1;
			} else {
				this.#keysPressed.left = false;
				
				if (this.#keysPressed.right) {
					this.#direction = 1;
				} else {
					this.#direction = 0;
				}
			}
		}
	}
}

export default SpaceshipMotionComponent;