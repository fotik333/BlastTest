import BlastStrategy from "./BlastStrategy";
import Game from "../Game";
import { GameFieldAnimatorComponent, GameFieldComponent } from "../components";
import GameSettings from "../GameSettings";

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
            this.onSupertilePressed(tileType, tileId);
            return;
        }

        let result = this.gameField.tryToBurnByColor(tileId);

        if (result.length < GameSettings.CurrentSettings.minGroupSize) {
            this.#animator.rejectBurn(result);
            return false;
        }
            
        let isSuperTileCreated = false;

        if (GameSettings.CurrentSettings.useSupertile) {
            let count = 0;
            result.forEach(ids => ids.forEach(_ => count++));

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

        return true;
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

        return true;
    }
};

export default DefaultBlastStrategy;