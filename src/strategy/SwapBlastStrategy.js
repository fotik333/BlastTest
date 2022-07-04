import { GameFieldAnimatorComponent } from "../components";
import BlastStrategy from "./BlastStrategy";

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
            return false;
        }

        if (this.#firstSelectedTileId === tileId) {
            this.#firstSelectedTileId = null;
            
            this.#animator.swapCancelled(tileId);
            return false;
        }

        let swappedTilesInfo = this.gameField.swapTiles(this.#firstSelectedTileId, tileId);
        this.#firstSelectedTileId = null;

        this.#animator.swap(swappedTilesInfo);

        return true;
    }
};

export default SwapBlastStrategy;