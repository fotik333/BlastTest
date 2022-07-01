import Component from "../core/Component";
import { SpaceshipAttackComponent } from ".";
import GameWorld from "../core/GameWorld";

class SetupComponent extends Component {
    #asteroids = [];
    #spaceship;
    #spaceshipAttack;
    #screen;
    #layout;

    constructor(screen, layout) {
        super();

        this.#screen = screen;
        this.#layout = layout;
    }

    onAwake() {
        let timer = this.#screen.getChildByName('Timer');
        timer.activate();
        
        this.#screen.on(this.#layout.events.onTimerEnd, this.onLoseCondition, this);

        this.#asteroids = GameWorld.findByName('Asteroid');

        this.#spaceship = GameWorld.findOneByName('Spaceship');
        this.#spaceshipAttack = this.#spaceship.getComponent(SpaceshipAttackComponent);

        let rocketsText = this.#screen.getChildByName('RocketsAmount');
        this.#spaceshipAttack.on('SHOT', _ => rocketsText.text = this.#spaceshipAttack.rocketsCount);
    }

    tick(dt) {
        if (this.#asteroids.length <= this.#spaceshipAttack.asteroidsDestroyed) {
            this.onWinCondition();
        }

        if (this.#spaceshipAttack.rocketsCount <= 0) {
            this.onLoseCondition();
        }
    }

    onWinCondition() {
        this.emit('WIN');
    }
    
    onLoseCondition() {
        this.emit('LOSE');
    }

    onDestroy() {
        this.#screen.off(this.#layout.events.onTimerEnd, this.onLoseCondition, this);
    }
}

export default SetupComponent;