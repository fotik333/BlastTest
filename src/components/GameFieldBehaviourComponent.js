import Component from "../core/Component";
import GameObject from "../core/GameObject";
import DisplayObjectComponent from "./DisplayObjectComponent";
import GameFieldComponent from "./GameFieldComponent";
import TileAnimationComponent from "./TileAnimationComponent";
import TileInputComponent from "./TileInputComponent";
import { createSprite } from '../utils/utils.js';
import GameObjectPool from "../utils/GameObjectPool";
import Game from "../Game";

class GameFieldBehaviourComponent extends Component {
    #model;
    #tilesMap = {};
    #container;
    #transform;

    constructor() {
        super();
    }

    onAwake() {
        this.#transform = this.gameObject.transform;
        this.#transform.scale = { x: 0.5, y: 0.5 };
        this.#transform.position = { x: 120, y: 120 };

        this.#container = this.gameObject.getComponent(DisplayObjectComponent).displayObject;

        this.tilesPool = new GameObjectPool(this._createTileFunc.bind(this), Game.sizeX * Game.sizeY);

        this.#model = this.gameObject.getComponent(GameFieldComponent);

        this.#model.on(GameFieldComponent.FIELD_CREATED, this._onFieldCreated.bind(this));
        this.#model.on(GameFieldComponent.FIELD_UPDATED, this._onFieldUpdated.bind(this));

        this.#model.on(GameFieldComponent.BURN_FINISHED, this._onBurnFinished.bind(this));
        this.#model.on(GameFieldComponent.BURN_REJECTED, this._onBurnRejected.bind(this));
    }

    async _onBurnFinished(result) {
        for (let i = 0; i < result.length; i++) {
            let ids = result[i];
            ids.forEach(id => this.#tilesMap[id].burn());

            await waiter(50);
        }

        await waiter(150);
        
        this.#model.updateField();
    }

    _onBurnRejected(result) {
        result.forEach(ids => {
            ids.forEach(id => this.#tilesMap[id].reject());
        });
    }

    async _onFieldUpdated(result) {
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

        await waiter(150);

        newTiles.forEach(tileInfo => {
            let tile = this.#tilesMap[tileInfo.id];
            tile.setType(tileInfo.type);
            tile.fallTo(tileInfo.col, tileInfo.row);
        });
    }

    _onFieldCreated(tilesMap) {
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
    }

    _onTilePressed(id) {
        this.#model.onTilePressed(id);
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

export default GameFieldBehaviourComponent;