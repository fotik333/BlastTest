import Component from "../core/Component";
import { CircleColliderComponent, SpaceshipAttackComponent } from ".";
import GameWorld from "../core/GameWorld";
import gameConfig from '../config/gameConfig.json';

class RocketBehaviorComponent extends Component {
	#direction = 0;
	#transform;
    #collider;
    #collideLayer;
    #spaceshipAttack;

   constructor(collideLayer) {
       super();

       this.#collideLayer = collideLayer;
   }

	onAwake() {
		this.#spaceshipAttack = GameWorld.findOneByName('Spaceship').getComponent(SpaceshipAttackComponent);
        this.#transform = this.gameObject.transform;
        this.#direction = -1;
        this.#collider = this.gameObject.getComponent(CircleColliderComponent);
	}

    tick(dt) {
        let y = this.#transform.position.y + gameConfig.rocketSpeed * dt * this.#direction;
		this.#transform.position = { x: this.#transform.position.x, y: y };

        let collisions = GameWorld.detectCollisions(this.#transform.position, this.#collider.radius, this.#collideLayer);
        
        collisions.forEach(c => {
            c.destroy();
            this.#spaceshipAttack.onAsteroidDestroyed();
        });

        if (!!collisions.length || y < -this.#collider.radius) {
            this.gameObject.returnToPool();
        }
    }
}

export default RocketBehaviorComponent;