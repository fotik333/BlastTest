import { GameFieldAnimatorComponent } from "../components";
import BlastStrategy from "./BlastStrategy";
import StrategyResult from "./StrategyResult";

class SwapBlastStrategy extends BlastStrategy {

    #firstSelectedTileId = null;
    #animator;

    initialize(gameField) {
        super.initialize(gameField);
        this.#animator = gameField.gameObject.getComponent(GameFieldAnimatorComponent);
    }

    onDeselected() {
        if (this.#firstSelectedTileId != null) {
            this.#animator.swapCancelled(this.#firstSelectedTileId);
        }

        this.#firstSelectedTileId = null;
    }

    onTilePressed(tileId) {
        if (this.#firstSelectedTileId == null) {
            this.#firstSelectedTileId = tileId;
            
            this.#animator.swapStarted(this.#firstSelectedTileId);
            return new StrategyResult(false, 0, false);
        }

        if (this.#firstSelectedTileId === tileId) {
            this.#firstSelectedTileId = null;
            
            this.#animator.swapCancelled(tileId);
            return new StrategyResult(false, 0, false);
        }

        let swappedTilesInfo = this.gameField.swapTiles(this.#firstSelectedTileId, tileId);
        this.#firstSelectedTileId = null;

        this.#animator.swap(swappedTilesInfo);

        return new StrategyResult(true, 0, false);
    }
};

export default SwapBlastStrategy;