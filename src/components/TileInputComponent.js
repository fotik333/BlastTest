import Component from "../core/Component";
import { DisplayObjectComponent } from ".";

class TileInputComponent extends Component {
    static TILE_PRESSED = 'TilePressed';

    #displayObject;

    onAwake() {
        this.#displayObject = this.gameObject.getComponent(DisplayObjectComponent).displayObject;

        this.#displayObject.interactive = true;
        this.#displayObject.on('pointerdown', this.onTilePressed.bind(this));
    }

    onTilePressed() {
        this.emit('TilePressed', this);
    }
}

export default TileInputComponent;