import Component from "../core/Component";
import GameSettings from "../GameSettings";
import Game from "../Game";

class GameFieldComponent extends Component {
    static SUPERTILE_ROW_TYPE;
    static SUPERTILE_COL_TYPE;

    static TILES_BURNED = 'TilesBurned';
    static STEP_DONE = 'StepDone';

    #sizeX
    #sizeY;
    #tilesMatrix = [[]];
    #tilesMap = {};

    #strategyApplyCallback = null;

    #strategyMap = {};
    #currentStrategy;

    #defaultStrategy;
    #defaultStrategyId = 'DefaultStrategy';

    constructor() {
        super();

        Game.strategies.forEach(data => this.#strategyMap[data.ID] = data.strategy);

        let defaultStrategyID = Game.strategies[0].ID;

        this.#defaultStrategyId = defaultStrategyID;
        this.#defaultStrategy = this.#strategyMap[defaultStrategyID];
        this.#currentStrategy = this.#defaultStrategy;

        let settings = GameSettings.CurrentSettings; 
        this.#sizeX = settings.sizeX;
        this.#sizeY = settings.sizeY;

        if (settings.useSupertile) {
            GameFieldComponent.SUPERTILE_COL_TYPE = settings.typesCount;
            GameFieldComponent.SUPERTILE_ROW_TYPE = settings.typesCount + 1;
        }

        this._generateField();
    }

    onAwake() {
        for (let strategyId in this.#strategyMap) {
            let strategy = this.#strategyMap[strategyId];
            strategy.initialize(this);
        }
    }

    get tilesMap() {
        return this.#tilesMap;
    }

    get tilesMatrix() {
        return this.#tilesMatrix;
    }

    enableStrategy(id, isEnabled, callback) {
        this._disableAllStrategies();

        if (isEnabled) {
            this.#strategyApplyCallback = callback;
            this.#currentStrategy = this.#strategyMap[id];
        } else {
            this.#strategyApplyCallback = null;
            this.#currentStrategy = this.#defaultStrategy;
        }
        
        this.#currentStrategy.onSelected();
    }

    enableDefaultStrategy() {
        this.enableStrategy(this.#defaultStrategyId, true);
    }

    _disableAllStrategies() {
        for (let strategyId in this.#strategyMap) {
            let strategy = this.#strategyMap[strategyId];
            strategy.onDeselected();
        }
    }

    getTilesCount(result) {
        let count = 0;
        result.forEach(ids => ids.forEach(_ => count++));
        return count;
    }

    onTilePressed(tileId) {
        let strategyResult = this.#currentStrategy.onTilePressed(tileId);
        
        if (strategyResult.wasGameFieldUpdated) {
            this.#strategyApplyCallback && this.#strategyApplyCallback();
            this.#strategyApplyCallback = null;
            this.enableDefaultStrategy();
        }
        
        let burnedTilesCount = strategyResult.burnedTilesCount;

        if (burnedTilesCount > 0) {
            this.emit(GameFieldComponent.TILES_BURNED, burnedTilesCount);
        }

        if (strategyResult.stepDone) {
            this.emit(GameFieldComponent.STEP_DONE);
        }
        
        this._updateFieldAfterStrategyApplied();
    }

    shuffle() {
        this.#tilesMatrix.sort(_ => Math.random() - .5);
        this.#tilesMatrix.forEach(column => column.sort(_ => Math.random() - .5));

        for (let i = 0; i < this.#tilesMatrix.length; i++) {
            let column = this.#tilesMatrix[i];

            for (let j = 0; j < column.length; j++) {
                let tileInfo = column[j];

                this.#tilesMap[tileInfo.id] = { col: i, row: j, type: tileInfo.type, moved: true };
            }
        }
    }

    checkCombinations() {
        let ids = Object.keys(this.#tilesMap);
        
        let combinationFound = false;

        for (let id of ids) {
            let result = this.tryToBurnByColor(id, true);
            let count = 0;
            result.forEach(ids => ids.forEach(_ => count++));

            if (count >= GameSettings.CurrentSettings.minGroupSize) {
                combinationFound = true;
                break;
            }
        }

        return combinationFound;
    }

    burnByRadius(id, radius) {
        let result = [[Number(id)]];
        let tileInfo = this.#tilesMap[id];
        let col = tileInfo.col;
        let row = tileInfo.row;

        for (let i = 0; i < this.#sizeX; i++) {
            for (let j = 0; j < this.#sizeY; j++) {

                let tmp = (col - i) * (col - i) + (row - j) * (row - j);

                if ((col - i) * (col - i) + (row - j) * (row - j) <= radius * radius) {
                    let index = Math.abs(Math.floor(Math.sqrt(tmp)));
                    
                    if (!result[index]) result[index] = [];

                    let tile = this.#tilesMatrix[i][j];
                    tile.burned = true;

                    if (col === i && row === j) continue;
                    result[index].push(tile.id);
                }
            }
        }

        return result;
    }

    tryToBurnByColor(id, withoutBurn) {
        let result = [[Number(id)]];
        let iteration = 0;
        let tmpResult;

        do {
            tmpResult = [];

            let lastFoundedTiles = result[iteration];

            lastFoundedTiles.forEach(id => {
                let tileInfo = this.#tilesMap[id];
                let nearElements = this._findNearbyTiles(tileInfo);

                nearElements = nearElements.filter(id => !result.find(set => set.find(el => el === id) !== undefined));
                nearElements = nearElements.filter(id => !tmpResult.find(el => el === id) !== undefined);
    
                tmpResult = tmpResult.concat(nearElements);
            });

            if (tmpResult.length > 0) {
                result.push(tmpResult);
            }

            iteration++;
        } while (tmpResult.length);

        if (result.length === 1) {
            return result;
        }

        let count = 0;

        if (!withoutBurn) {
            for (let i = 0; i < result.length; i++) {
                result[i].forEach(id => {
                    count++;

                    let tileInfo = this.#tilesMap[id];
                    this.#tilesMatrix[tileInfo.col][tileInfo.row].burned = true;
                });
            }
        }

        return result;
    }

    burnByRow(id) {
        let result = [[id]];
        
        let tileInfo = this.#tilesMap[id];

        let col = tileInfo.col;
        let row = tileInfo.row;

        for (let i = 0; i < this.#sizeX; i++) {
            let tile = this.#tilesMatrix[i][row];
            tile.burned = true;

            if (i !== col) {
                let tmp = Math.abs(col - i);

                if (!result[tmp]) result[tmp] = [];

                result[tmp].push(tile.id);
            }
        }

        return result;
    }

    burnByCol(id) {
        let result = [[id]];
        
        let tileInfo = this.#tilesMap[id];

        let col = tileInfo.col;
        let row = tileInfo.row;

        for (let i = 0; i < this.#sizeY; i++) {
            let tile = this.#tilesMatrix[col][i];
            tile.burned = true;

            if (i !== row) {
                let tmp = Math.abs(row - i);

                if (!result[tmp]) result[tmp] = [];
                
                result[tmp].push(tile.id);
            }
        }
        
        return result;
    }

    _findNearbyTiles({ type, col, row }) {
        let result = [];

        let tileInfo;

        if (col >= 1) {
            tileInfo = this.#tilesMatrix[col - 1][row];
            if (tileInfo.type === type) result.push(tileInfo.id);
        }

        if (col < GameSettings.CurrentSettings.sizeX - 1) {
            tileInfo = this.#tilesMatrix[col + 1][row];
            if (tileInfo.type === type) result.push(tileInfo.id);
        }

        if (row >= 1) {
            tileInfo = this.#tilesMatrix[col][row - 1];
            if (tileInfo.type === type) result.push(tileInfo.id);
        }
        
        if (row < GameSettings.CurrentSettings.sizeY - 1) {
            tileInfo = this.#tilesMatrix[col][row + 1];
            if (tileInfo.type === type) result.push(tileInfo.id);
        }

        return result;
    }

    swapTiles(firstId, secondId) {
        let firstTile = this.#tilesMap[firstId];
        let secondTile = this.#tilesMap[secondId];

        this.#tilesMatrix[firstTile.col][firstTile.row] = { id: Number(secondId), type: secondTile.type };
        this.#tilesMatrix[secondTile.col][secondTile.row] = { id: Number(firstId), type: firstTile.type };

        [firstTile.col, secondTile.col] = [secondTile.col, firstTile.col];
        [firstTile.row, secondTile.row] = [secondTile.row, firstTile.row];

        return [
            { id: firstId, col: firstTile.col, row: firstTile.row }, 
            { id: secondId, col: secondTile.col, row: secondTile.row }
        ];
    }

    _updateFieldAfterStrategyApplied() {
        for (let i = 0; i < this.#tilesMatrix.length; i++) {
            let col = this.#tilesMatrix[i];

            if (!col.find(el => el.burned)) continue;

            let newTiles = [];
            let counter = 1;

            for (let j = col.length - 1; j >= 0; j--) {
                let tile = col[j];
                let tileInfo = this.#tilesMap[tile.id];

                if (tile.burned) {
                    tile.burned = false;
                    tileInfo.generated = true;

                    newTiles.push(tile.id);
                } else {
                    let newRow = col.length - counter;
                    col[newRow] = tile;

                    tileInfo.col = i;
                    tileInfo.row = newRow;
                    tileInfo.moved = true;

                    counter++;
                }
            }

            for (let emptyCount = col.length - counter; emptyCount >= 0; emptyCount--) {
                let tileId = newTiles.pop();
                let tileInfo = this.#tilesMap[tileId];
                let type = this._generateType();

                col[emptyCount] = { id: tileId, type };

                tileInfo.row = emptyCount;
                tileInfo.col = i;
                tileInfo.type = type;
            }
        }
    }

    clearFlags() {
        Object.keys(this.#tilesMap).forEach(id => {
            let info = this.#tilesMap[id];

            info.burned = false;
            info.moved = false;
            info.generated = false;
        });
    }

    _generateType() {
        return Math.floor(Math.random() * GameSettings.CurrentSettings.typesCount);
    }

    generateSupertileType() {
        return ((Math.random() > .5) ? GameFieldComponent.SUPERTILE_COL_TYPE : GameFieldComponent.SUPERTILE_ROW_TYPE);
    }

    _generateField() {
        let id = 0;

        for (let col = 0; col < this.#sizeX; col++) {
            for (let row = 0; row < this.#sizeY; row++) {
                if (!this.#tilesMatrix[col]) this.#tilesMatrix[col] = [];
                
                let type = this._generateType();

                this.#tilesMatrix[col][row] = { type, id };
                this.#tilesMap[id] = { col, row, type };

                id++;
            }
        }
    }
}

export default GameFieldComponent;