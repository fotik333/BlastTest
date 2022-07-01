import Component from "../core/Component";
import { SpaceshipAttackComponent, DisplayObjectComponent, TileAnimationComponent } from ".";
import GameWorld from "../core/GameWorld";
import Game from "../Game";

class TileInputComponent extends Component {
    #displayObject;
    #tile;

    constructor(screen, layout) {
        super();
    }

    onAwake() {
        this.#tile = this.gameObject.getComponent(TileAnimationComponent);
        this.#displayObject = this.gameObject.getComponent(DisplayObjectComponent).displayObject;

        this.#displayObject.interactive = true;
        this.#displayObject.on('pointerdown', this.onTilePressed.bind(this));
    }

    onTilePressed() {
        this.emit('TilePressed', this);
    }
}

export default TileInputComponent;