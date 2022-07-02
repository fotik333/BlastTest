import Component from "../core/Component";
import Game from "../Game";

class BlastLogicComponent extends Component {
    #tilesMatrix = [[]];
    #tilesMap = {};

    #bombActive = false;
    #bombCallback;

    #swapActive = false;
    #swapCallback;

    #swapTileId = null;

    constructor() {
        super();

        this._generateField();
    }

    getField() {
        return this.#tilesMap;
    }

    onBombPressed(active, cb) {
        this.#swapActive = false;
        this.#swapTileId = null;

        this.#bombActive = active;

        if (cb) this.#bombCallback = cb 
        else this.#bombCallback = null;
    }

    disableBomb() {
        this.#bombActive = false;
        this.#bombCallback && this.#bombCallback();
    }

    onSwapPressed(active, cb) {
        this.#bombActive = false;

        this.#swapActive = active;

        if (!active) this.#swapTileId = null;

        if (cb) this.#swapCallback = cb 
        else this.#swapCallback = null;
    }

    disableSwap() {
        this.#swapActive = false;
        this.#swapCallback && this.#swapCallback();
    }

    shuffle() {
        // for (let i = 0; i < this.#tilesMatrix.length; i++) {
        //     let j = this.#tilesMatrix[i].length;

        //     while (--j) {
        //         let k = Math.floor(Math.random() * (j + 1));

        //         let tempj = this.#tilesMatrix[i][j];
        //         let tempk = this.#tilesMatrix[i][k];

        //         this.#tilesMatrix[i][j] = tempk;
        //         this.#tilesMatrix[i][k] = tempj;
        //     }

        //     return this.#tilesMatrix;
        // }

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
            let result = this.findGroupByColor(id, true);
            let count = 0;
            result.forEach(ids => ids.forEach(_ => count++));

            if (count >= Game.minGroupSize) {
                combinationFound = true;
                break;
            }
        }

        return combinationFound;
    }

    onTilePressed(id) {
        let result;

        if (this.#swapActive) {
            if (!this.#swapTileId) {
                this.#swapTileId = id;
                result = [this.#swapTileId];
                result.status = 'swapStarted';
            } else {
                if (id === this.#swapTileId) return { status: 'none' };

                result = this.swapTiles(id);
                result.status = 'swapFinished';

                this.disableSwap();
            }
        } else if (this.#bombActive) {
            result = this.findGroupByRadius(id, Game.bombRadius);
            result.status = 'burned';

            this.disableBomb();
        } else {
            result = this.findGroupByColor(id);
            result.status = 'burned';

            if (result.length < Game.minGroupSize) {
                result.status = 'rejected';
            } else {
                // if (Game.useSupertile) {
                //     let count = 0;
                //     result.forEach(ids => ids.forEach(_ => count++));

                //     if (count >= Game.supertileMinGroupSize) {
                //         result.shift();
                //     }
                // } else {
                // }
            }
        }

        this.updateField();

        return result;
    }

    swapTiles(id) {
        let ids = [this.#swapTileId, id];
        this.#swapTileId = null;

        let tile0info = this.#tilesMap[ids[0]];
        let tile1info = this.#tilesMap[ids[1]];

        this.#tilesMatrix[tile0info.col][tile0info.row] = { id: Number(ids[1]), type: tile1info.type };
        this.#tilesMatrix[tile1info.col][tile1info.row] = { id: Number(ids[0]), type: tile0info.type };

        [tile0info.col, tile1info.col] = [tile1info.col, tile0info.col];
        [tile0info.row, tile1info.row] = [tile1info.row, tile0info.row];

        return [{ id: ids[0], col: tile0info.col, row: tile0info.row }, { id: ids[1], col: tile1info.col, row: tile1info.row }];
    }

    findGroupByRadius(id, radius) {
        let result = [[Number(id)]];
        let tileInfo = this.#tilesMap[id];
        let col = tileInfo.col;
        let row = tileInfo.row;

        for (let i = 0; i < this.#tilesMatrix.length; i++) {
            for (let j = 0; j < this.#tilesMatrix[0].length; j++) {
                if ((col - i) * (col - i) + (row - j) * (row - j) <= radius * radius) {
                    result[0].push(this.#tilesMatrix[i][j].id);
                    this.#tilesMatrix[i][j].burned = true;
                }
            }
        }

        return result;
    }

    findGroupByColor(id, withoutBurn) { //TODO
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

        // if (Game.useSupertile && count >= Game.supertileMinGroupSize) {
        //     //TODO bug with 1 length result
        //     let id = result.shift();

        //     let tileInfo = this.#tilesMap[id];
        //     this.#tilesMatrix[tileInfo.col][tileInfo.row].burned = false;
        // }

        return result;
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
    }

    clearFlags() {
        Object.keys(this.#tilesMap).forEach(id => {
            let info = this.#tilesMap[id];
            info.burned = false;
            info.moved = false;
            info.generated = false;
        });
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
    }

    _generateType() {
        let r = Math.random();

        if (Game.useSupertile) {
            //TODO
        }
        
        return Math.floor(Math.random() * Game.typesCount);
    }
}

export default BlastLogicComponent;