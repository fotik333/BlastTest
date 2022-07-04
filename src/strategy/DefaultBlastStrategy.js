import BlastStrategy from "./BlastStrategy";
import Game from "../Game";
import { GameFieldAnimatorComponent, GameFieldComponent } from "../components";
import GameSettings from "../GameSettings";
import StrategyResult from "./StrategyResult";

class DefaultBlastStrategy extends BlastStrategy {
    
    #animator;

    initialize(gameField) {
        super.initialize(gameField);
        this.#animator = gameField.gameObject.getComponent(GameFieldAnimatorComponent);
    }

    onTilePressed(tileId) {
        let tileInfo = this.gameField.tilesMap[tileId];
        let tileType = tileInfo.type;

        if (tileType >= GameSettings.CurrentSettings.typesCount) {
            return this.onSupertilePressed(tileType, tileId);
        }

        let result = this.gameField.tryToBurnByColor(tileId);

        if (result.length < GameSettings.CurrentSettings.minGroupSize) {
            this.#animator.rejectBurn(result);
            return new StrategyResult(false, 0, false);
        }
            
        let isSuperTileCreated = false;

        let count = this.gameField.getTilesCount(result);

        if (GameSettings.CurrentSettings.useSupertile) {
            if (count >= GameSettings.CurrentSettings.supertileMinGroupSize) {
                let tileInfo = this.gameField.tilesMap[result[0][0]];
                let tile = this.gameField.tilesMatrix[tileInfo.col][tileInfo.row];
                tile.burned = false;

                let newType = this.gameField.generateSupertileType();
                tileInfo.type = newType;
                tile.type = newType;

                isSuperTileCreated = true;

                this.#animator.createSupertile(result[0][0], newType);
            }
        }

        this.#animator.burn(result, isSuperTileCreated);

        return new StrategyResult(true, count, true);
    }

    onSupertilePressed(tileType, tileId) {
        let result;

        switch (tileType) {
            case GameFieldComponent.SUPERTILE_COL_TYPE:
                result = this.gameField.burnByCol(tileId);
                break;
            case GameFieldComponent.SUPERTILE_ROW_TYPE:
                result = this.gameField.burnByRow(tileId);
                break;
        }

        this.#animator.burn(result);

        let count = this.gameField.getTilesCount(result);
        return new StrategyResult(true, count, true);
    }
};

export default DefaultBlastStrategy;