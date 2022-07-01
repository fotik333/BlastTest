import Component from "../core/Component";
import { WIDTH, HEIGHT } from '../config/layout';
import { CircleColliderComponent } from ".";
import gameConfig from '../config/gameConfig.json';

class AsteroidBehaviorComponent extends Component {
	#direction = { x: 0, y: 0 };
	#transform;
    #collider;
    #borderY;

    constructor(direction, borderY) {
        super();
        
        this.#borderY = borderY;
        if (direction) this.#direction = direction;
    }

	onAwake() {
		this.#transform = this.gameObject.transform;
        this.#collider = this.gameObject.getComponent(CircleColliderComponent);
	}

    tick(dt) {
        let position = { x: this.#transform.position.x, y: this.#transform.position.y };

        if (position.x + this.#collider.radius > WIDTH || position.x - this.#collider.radius < 0) this.#direction.x = -this.#direction.x;
        position.x += this.#direction.x * dt;
        
        if (position.y + this.#collider.radius > HEIGHT - this.#borderY - gameConfig.margin || position.y - this.#collider.radius < 0) this.#direction.y = -this.#direction.y;
        position.y += this.#direction.y * dt;

        this.#transform.position = position;
    }
}

export default AsteroidBehaviorComponent;