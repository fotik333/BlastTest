import GameSession from "../core/GameSession";
import { layoutConfig, WIDTH, HEIGHT } from '../config/layout';
import GameObject from "../core/GameObject";
import { DisplayObjectComponent, GameFieldAnimatorComponent, GameFieldComponent } from '../components';
import { Graphics, Container } from "pixi.js";
import { createSprite } from '../utils/utils.js';
import BoostersControllerComponent from "../components/BoostersControllerComponent";
import HUDControllerComponent from "../components/HUDControllerComponent";
import GameSettings from "../GameSettings";

const maxWidth = 800;
const maxHeight = 700;

export default class BlastGameSession extends GameSession {
    #layout = layoutConfig.gameScreen;
    #gameField;

    constructor(screen) {
        super(screen);

        this.inflate(this.#layout);

        this._initGameObjects();
        this._initUI();
    }

    _initGameObjects() {
        this._initGameField();
    }

    _initGameField() {
        this.#gameField = new GameFieldComponent();
        
        let components = [
            new DisplayObjectComponent(new Container, this.screen),
            new GameFieldAnimatorComponent(this.#gameField),
            this.#gameField
        ];

        let tileSprite = createSprite({ texture: 'tile' });
        let offsetX = tileSprite.width;
        let offsetY = tileSprite.height;

        let gameFieldGameObject = new GameObject('GameField', components);

        //TODO move to ?
        let sizeX = GameSettings.CurrentSettings.sizeX;
        let sizeY = GameSettings.CurrentSettings.sizeY;

        let widthRatio = maxWidth / (sizeX * offsetX);
        let heightRatio = maxWidth / (sizeY * offsetY);
        let ratio = Math.min(widthRatio, heightRatio);

        gameFieldGameObject.transform.scale = { x: ratio, y: ratio };
        gameFieldGameObject.transform.position = { x: 200, y: 250 };

        offsetX = offsetX * ratio;
        offsetY = offsetY * ratio;

        let gameFieldBG = this.screen.getChildByName('GameFieldBG');

        gameFieldBG.beginFill(0x9ed7e1).drawRoundedRect(
            200 - 3 * offsetX / 4 - 20,
            250 - 3 * offsetY / 4 - 20,
            sizeX * offsetX + offsetX / 2 + 40,
            sizeY * offsetY + offsetY / 2 + 40,
            offsetX / 4
        );

        gameFieldBG.beginFill(0x0d233d).drawRoundedRect(
            200 - 3 * offsetX / 4,
            250 - 3 * offsetY / 4,
            sizeX * offsetX + offsetX / 2,
            sizeY * offsetY + offsetY / 2,
            offsetX / 4
        );
    }

    _initUI() {
        let boostersController = new BoostersControllerComponent(this.screen, this.#layout);
        let hudController = new HUDControllerComponent(this.screen, this.#layout);
        
        let components = [
            boostersController,
            hudController
        ];

        new GameObject('UI', components);
    }

    onWin() {
        this.emit(GameSession.SESSION_END, true);
    }

    onLose() {
        this.emit(GameSession.SESSION_END, false);
    }
}