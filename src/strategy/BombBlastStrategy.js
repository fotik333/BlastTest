import BlastStrategy from "./BlastStrategy";
import { GameFieldAnimatorComponent } from "../components";
import GameSettings from "../GameSettings";

class BombBlastStrategy extends BlastStrategy {
    #animator;

    initialize(gameField) {
        super.initialize(gameField);
        this.#animator = gameField.gameObject.getComponent(GameFieldAnimatorComponent);
    }

    onTilePressed(tileId) {
        let result = this.gameField.burnByRadius(tileId, GameSettings.CurrentSettings.bombRadius);

        this.#animator.burn(result);

        return true;
    }
};

export default BombBlastStrategy;