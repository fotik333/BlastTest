import GameSession from "../core/GameSession";
import { layoutConfig, MAX_FIELD_SIZE } from '../config/layout';
import GameObject from "../core/GameObject";
import { DisplayObjectComponent, GameFieldAnimatorComponent, GameFieldComponent } from '../components';
import { Container } from "pixi.js";
import { createSprite } from '../utils/utils.js';
import BoostersControllerComponent from "../components/BoostersControllerComponent";
import HUDControllerComponent from "../components/HUDControllerComponent";
import GameSettings from "../GameSettings";

export default class BlastGameSession extends GameSession {
    #layout = layoutConfig.gameScreen;
    #gameField;
    #hudController;
    #gameFieldBGGraphics;

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

        let gameFieldGameObject = new GameObject('GameField', components);
        this._configureGameFieldTransform(gameFieldGameObject);
    }

    _initUI() {
        let boostersController = new BoostersControllerComponent(this.screen, this.#layout);
        this.#hudController = new HUDControllerComponent(this.screen, this.#layout);
        
        let components = [
            boostersController,
            this.#hudController
        ];

        new GameObject('UI', components);

        this.#hudController.on(HUDControllerComponent.WIN, this._onWin.bind(this));
        this.#hudController.on(HUDControllerComponent.LOSE, this._onLose.bind(this));
        this.#hudController.on(HUDControllerComponent.RETURN_TO_MENU, this._onReturnToMenu.bind(this));
    }

    _configureGameFieldTransform(gameField) {
        let tileSprite = createSprite({ texture: 'tile' });
        let offsetX = tileSprite.width;
        let offsetY = tileSprite.height;

        let sizeX = GameSettings.CurrentSettings.sizeX;
        let sizeY = GameSettings.CurrentSettings.sizeY;

        let widthRatio = MAX_FIELD_SIZE / (sizeX * offsetX);
        let heightRatio = MAX_FIELD_SIZE / (sizeY * offsetY);
        let ratio = Math.min(widthRatio, heightRatio);

        gameField.transform.scale = { x: ratio, y: ratio };
        
        let startX = 150 + offsetX * ratio;
        let startY = 150 + offsetY * ratio;

        gameField.transform.position = { x: startX, y: startY };

        offsetX = offsetX * ratio;
        offsetY = offsetY * ratio;

        let gameFieldBGGraphics = this.screen.getChildByName('GameFieldBG');

        gameFieldBGGraphics.beginFill(0x9ed7e1).drawRoundedRect(
            startX - 3 * offsetX / 4 - 20,
            startY - 3 * offsetY / 4 - 20,
            sizeX * offsetX + offsetX / 2 + 40,
            sizeY * offsetY + offsetY / 2 + 40,
            offsetX / 4
        );

        gameFieldBGGraphics.beginFill(0x0d233d).drawRoundedRect(
            startX - 3 * offsetX / 4,
            startY - 3 * offsetY / 4,
            sizeX * offsetX + offsetX / 2,
            sizeY * offsetY + offsetY / 2,
            offsetX / 4
        );
        
        this.#gameFieldBGGraphics = gameFieldBGGraphics;
    }

    _onReturnToMenu() {
        this.emit(GameSession.RETURN_TO_MENU);
    }

    _onWin() {
        this.emit(GameSession.SESSION_END, true);
    }

    _onLose() {
        this.emit(GameSession.SESSION_END, false);
    }

    finish() {
        super.finish();

        this.#gameFieldBGGraphics.clear();

        this.screen.removeAllListeners();
        
        this.#hudController.off(HUDControllerComponent.WIN, this._onWin.bind(this));
        this.#hudController.off(HUDControllerComponent.LOSE, this._onLose.bind(this));
        this.#hudController.off(HUDControllerComponent.RETURN_TO_MENU, this._onReturnToMenu.bind(this));
    }
}