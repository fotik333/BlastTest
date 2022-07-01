import Component from "../core/Component";
import Game from "../Game";
import GameFieldBehaviourComponent from "./GameFieldBehaviourComponent";

class GameFieldComponent extends Component {
    static FIELD_CREATED = 'FieldCreated';
    static FIELD_UPDATED = 'FieldUpdated';

    static BURN_REJECTED = 'BurnRejected';
    static BURN_FINISHED = 'BurnFinished';
    
    #tilesMatrix = [[]];
    #tilesMap = {};

    constructor() {
        super();
    }

    onAwake() {
        this._generateField();
    }

    onTilePressed(id) {
        //TODO
        let result = this.burnByColor(id);

        if (result.length < Game.minGroupSize) {
            this.emit(GameFieldComponent.BURN_REJECTED, result);
        } else {
            this.emit(GameFieldComponent.BURN_FINISHED, result);
        }
    }

    burnByColor(id) {
        let result = [[Number(id)]];
        let iteration = 0;
        let tmpResult;

        do {
            tmpResult = [];

            let lastFoundedTiles = result[iteration];

            lastFoundedTiles.forEach(id => {
                let tileInfo = this.#tilesMap[id];
                let nearElements = this._findNearbyTiles(tileInfo);

                nearElements = nearElements.filter(id => !result.find(set => set.find(el => el === id)));
                nearElements = nearElements.filter(id => !tmpResult.find(el => el === id));
    
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

        for (let i = 0; i < result.length; i++) {
            result[i].forEach(id => {
                let tileInfo = this.#tilesMap[id];
                this.#tilesMatrix[tileInfo.col][tileInfo.row].burned = true;
            });
        }

        return result;
    }

    updateField() {
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

        let result = structuredClone(this.#tilesMap);

        Object.keys(this.#tilesMap).forEach(key => {
            let info = this.#tilesMap[key];
            info.burned = false;
            info.moved = false;
            info.generated = false;
        });

        this.emit(GameFieldComponent.FIELD_UPDATED, result);
    }

    _findNearbyTiles({ type, col, row }) {
        let result = [];

        let tileInfo;

        if (col >= 1) {
            tileInfo = this.#tilesMatrix[col - 1][row];
            if (tileInfo.type === type) result.push(tileInfo.id);
        }

        if (col < Game.sizeX - 1) {
            tileInfo = this.#tilesMatrix[col + 1][row];
            if (tileInfo.type === type) result.push(tileInfo.id);
        }

        if (row >= 1) {
            tileInfo = this.#tilesMatrix[col][row - 1];
            if (tileInfo.type === type) result.push(tileInfo.id);
        }
        
        if (row < Game.sizeY - 1) {
            tileInfo = this.#tilesMatrix[col][row + 1];
            if (tileInfo.type === type) result.push(tileInfo.id);
        }

        return result;
    }

    _generateField() {
        let id = 0;

        for (let col = 0; col < Game.sizeX; col++) {
            for (let row = 0; row < Game.sizeY; row++) {
                if (!this.#tilesMatrix[col]) this.#tilesMatrix[col] = [];
                
                let type = this._generateType();

                this.#tilesMatrix[col][row] = { type, id };
                this.#tilesMap[id] = { col, row, type };

                id++;
            }
        }

        this.emit(GameFieldComponent.FIELD_CREATED, this.#tilesMap);
    }

    _generateType() {
        return Math.floor(Math.random() * Game.typesCount);
    }
}

export default GameFieldComponent;