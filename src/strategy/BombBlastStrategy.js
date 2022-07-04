import BlastStrategy from "./BlastStrategy";
import { GameFieldAnimatorComponent } from "../components";
import GameSettings from "../GameSettings";
import StrategyResult from "./StrategyResult";

class BombBlastStrategy extends BlastStrategy {
    #animator;

    initialize(gameField) {
        super.initialize(gameField);
        this.#animator = gameField.gameObject.getComponent(GameFieldAnimatorComponent);
    }

    onTilePressed(tileId) {
        let result = this.gameField.burnByRadius(tileId, GameSettings.CurrentSettings.bombRadius);

        this.#animator.burn(result);

        let count = this.gameField.getTilesCount(result);
        return new StrategyResult(true, count, false);
    }
};

export default BombBlastStrategy;