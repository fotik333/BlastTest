import Component from "../core/Component";
import GameObject from "../core/GameObject";
import { DisplayObjectComponent, TileComponent, TileInputComponent } from "./";
import { createSprite } from '../utils/utils.js';
import GameObjectPool from "../utils/GameObjectPool";
import GameSettings from "../GameSettings";

class GameFieldAnimatorComponent extends Component {
    #gameField;
    #tilesMap = {};
    #container;
    #animationPlaying = false;
    #destroyed = false;

    constructor(gameField) {
        super();

        this.#gameField = gameField;
    }

    get animationPlaying() {
        return this.#animationPlaying;
    }

    onAwake() {
        this.#container = this.gameObject.getComponent(DisplayObjectComponent).displayObject;

        this.tilesPool = new GameObjectPool(this._createTileFunc.bind(this), GameSettings.CurrentSettings.sizeX * GameSettings.CurrentSettings.sizeY);

        this._createField();
    }

    async createSupertile(id, type) {
        this.#tilesMap[id].superTile(type);
    }

    async burn(result, superTile) {
        this.#animationPlaying = true;

        for (let i = superTile ? 1 : 0; i < result.length; i++) {
            let ids = result[i];
            ids.forEach(id => this.#tilesMap[id].burn());

            await waiter(50);
        }

        await waiter(100);

        this.#animationPlaying = false;

        if (this.#destroyed) return;
        
        this._updateField();
    }

    async swapCancelled(tileID) {
        this.#tilesMap[tileID].swapCancelled();
    }

    async swapStarted(tileID) {
        this.#tilesMap[tileID].swapReady();
    }

    async swap(result) {
        this.#animationPlaying = true;

        result.forEach(tileInfo => {
            let tile = this.#tilesMap[tileInfo.id];
            tile.moveTo(tileInfo.col, tileInfo.row);
        });

        await waiter(250);

        this.#animationPlaying = false;
    }

    async rejectBurn(result) {
        this.#animationPlaying = true;

        result.forEach(ids => {
            ids.forEach(id => this.#tilesMap[id].reject());
        });
        
        await waiter(150);
        
        this.#animationPlaying = false;
    }

    async _updateField() {
        this.#animationPlaying = true;

        let result = this.#gameField.tilesMap;

        let keys = Object.keys(result);
        let movedTiles = [];
        let newTiles = [];

        for (let key in keys) {
            let tileInfo = result[key];

            if (tileInfo.moved) movedTiles.push(Object.assign(tileInfo, { id: key }));
            if (tileInfo.generated) newTiles.push(Object.assign(tileInfo, { id: key }));
        }

        await waiter(150);
        if (this.#destroyed) return;

        movedTiles.forEach(tileInfo => {
            let tile = this.#tilesMap[tileInfo.id];
            tile.moveTo(tileInfo.col, tileInfo.row);
        });

        await waiter(50);
        if (this.#destroyed) return;

        newTiles.forEach(tileInfo => {
            let tile = this.#tilesMap[tileInfo.id];
            tile.setType(tileInfo.type);
            tile.fallTo(tileInfo.col, tileInfo.row);
        });

        this.#gameField.clearFlags();

        await waiter(200);
        if (this.#destroyed) return;
        
        this._checkCombinations();
    }

    _checkCombinations() {
        let isCombinationExists = this.#gameField.checkCombinations();

        if (!isCombinationExists) {
            //TODO ограничить перемешивания
            this.#gameField.shuffle();
            this._updateField();
            return;
        }
        
        this.#animationPlaying = false;
    }

    onTilePressed(id) {
        if (this.#animationPlaying) return;

        this.#gameField.onTilePressed(id);
    }

    _createField() {
        let tilesMap = this.#gameField.tilesMap;

        Object.keys(tilesMap).forEach(id => {
            let tileInfo = tilesMap[id];

            let tile = this.tilesPool.getNext();

            let tileComponent = tile.getComponent(TileComponent);
            tileComponent.setPosition(tileInfo.col, tileInfo.row);
            tileComponent.setType(tileInfo.type);

            let tileInputComponent = tile.getComponent(TileInputComponent);
            tileInputComponent.on(TileInputComponent.TILE_PRESSED, _ => this.onTilePressed(id));

            this.#tilesMap[id] = tileComponent;
        });

        this._checkCombinations();
    }

    _createTileFunc() {
        let sprite = createSprite({ texture: 'tile', anchor: [.5]});
        
        let components = [
            new DisplayObjectComponent(sprite, this.#container),
            new TileComponent(),
            new TileInputComponent()
        ];

        let tile = new GameObject('Tile', components);

        return tile;
    }

    onDestroy() {
        // this.#destroyed = true;
    }
}

export default GameFieldAnimatorComponent;