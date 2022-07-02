import Component from "../core/Component";
import GameObject from "../core/GameObject";
import DisplayObjectComponent from "./DisplayObjectComponent";
// import BlastLogicComponent from "./BlastLogicComponent";
import TileAnimationComponent from "./TileAnimationComponent";
import TileInputComponent from "./TileInputComponent";
import { createSprite } from '../utils/utils.js';
import GameObjectPool from "../utils/GameObjectPool";
import Game from "../Game";

class GameFieldAnimatorComponent extends Component {
    #logic;
    #tilesMap = {};
    #container;
    #transform;
    #tileToSwap;

    constructor(logic) {
        super();

        this.#logic = logic;
    }

    onAwake() {
        this.#transform = this.gameObject.transform;
        this.#transform.scale = { x: 0.5, y: 0.5 };
        this.#transform.position = { x: 120, y: 120 };

        this.#container = this.gameObject.getComponent(DisplayObjectComponent).displayObject;

        this.tilesPool = new GameObjectPool(this._createTileFunc.bind(this), Game.sizeX * Game.sizeY);

        this._createField(this.#logic.getField());
    }

    _onTilePressed(id) {
        let result = this.#logic.onTilePressed(id);

        switch (result.status) {
            case 'burned':
                this._onBurnFinished(result);
                break;
            case 'rejected':
                this._onBurnRejected(result);
                break;
            case 'swapStarted':
                this._onSwapStarted(result);
                break;
            case 'swapFinished':
                this._onSwapFinished(result);
                break;
            default:
                break;
        }
    }

    async _onBurnFinished(result) {
        for (let i = 0; i < result.length; i++) {
            let ids = result[i];
            ids.forEach(id => this.#tilesMap[id].burn());

            await waiter(50);
        }

        await waiter(150);
        
        this._updateField();
    }

    _onSwapStarted(result) {
        this.#tilesMap[result[0]].swapReady();
    }

    _onSwapFinished(result) {
        result.forEach(tileInfo => {
            let tile = this.#tilesMap[tileInfo.id];
            tile.moveTo(tileInfo.col, tileInfo.row);
        });
    }

    _onBurnRejected(result) {
        result.forEach(ids => {
            ids.forEach(id => this.#tilesMap[id].reject());
        });
    }

    async _updateField() {
        let result = this.#logic.getField();

        let keys = Object.keys(result);
        let movedTiles = [];
        let newTiles = [];

        for (let key in keys) {
            let tileInfo = result[key];

            if (tileInfo.moved) movedTiles.push(Object.assign(tileInfo, { id: key }));
            if (tileInfo.generated) newTiles.push(Object.assign(tileInfo, { id: key }));
        }

        await waiter(150);

        movedTiles.forEach(tileInfo => {
            let tile = this.#tilesMap[tileInfo.id];
            tile.moveTo(tileInfo.col, tileInfo.row);
        });

        await waiter(50);

        newTiles.forEach(tileInfo => {
            let tile = this.#tilesMap[tileInfo.id];
            tile.setType(tileInfo.type);
            tile.fallTo(tileInfo.col, tileInfo.row);
        });

        this.#logic.clearFlags();

        await waiter(100);
        this._checkCombinations();
    }

    _checkCombinations() {
        let isCombinationExists = this.#logic.checkCombinations();

        if (!isCombinationExists) {
            this.#logic.shuffle();
            this._updateField();
        }
    }

    _createField(tilesMap) {
        Object.keys(tilesMap).forEach(key => {
            let tileInfo = tilesMap[key];

            let tile = this.tilesPool.getNext();

            let tileComponent = tile.getComponent(TileAnimationComponent);
            tileComponent.setPosition(tileInfo.col, tileInfo.row);
            tileComponent.setType(tileInfo.type);

            let inputComponent = tile.getComponent(TileInputComponent);
            inputComponent.on('TilePressed', this._onTilePressed.bind(this, key));

            this.#tilesMap[key] = tileComponent;
        });

        this._checkCombinations();
    }

    _createTileFunc() {
        let sprite = createSprite({ texture: 'tile', anchor: [.5]});
        
        let components = [
            new DisplayObjectComponent(sprite, this.#container),
            new TileAnimationComponent(),
            new TileInputComponent()
        ];

        let tile = new GameObject('Tile', components);

        return tile;
    }
}

export default GameFieldAnimatorComponent;