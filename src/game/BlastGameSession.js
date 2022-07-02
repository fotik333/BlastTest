import GameSession from "../core/GameSession";
import { layoutConfig, WIDTH, HEIGHT } from '../config/layout';
import gameConfig from '../config/gameConfig.json';
import GameObject from "../core/GameObject";
import { DisplayObjectComponent, BlastLogicComponent, GameFieldAnimatorComponent } from '../components';
import { Graphics, Container } from "pixi.js";
import { createSprite } from '../utils/utils.js';
import { Tween, Easing } from "@tweenjs/tween.js";
import Game from "../Game";

export default class BlastGameSession extends GameSession {
    #layout = layoutConfig.gameScreen;
    #config;
    #logic;

    constructor(screen, config) {
        super(screen);

        this.#config = config;
        this.inflate(this.#layout);

        this._initGameObjects();
        this._initUI();
        // this._initSetup();
    }

    _initUI() {
        this.timer = this.screen.getChildByName('Timer');
        this.timer.setup(gameConfig.gameTime);

        this.bombButton = this.screen.getChildByName('BoosterBombButton');
        this.bombButton.setCount(Game.bombCount);
        this.screen.on(this.#layout.events.onBombButtonPressed, this._updateBombButtonState.bind(this));

        this.swapButton = this.screen.getChildByName('BoosterSwapButton');
        this.swapButton.setCount(Game.swapCount);
        this.screen.on(this.#layout.events.onSwapButtonPressed, this._updateSwapButtonState.bind(this));
    }

    _updateSwapButtonState() {
        this.bombButton.setActive(false);

        this.swapButton.switchActive();
        this.#logic.onSwapPressed(this.swapButton.getActive(), _ => this.swapButton.boosterUsed());
    }

    _updateBombButtonState() {
        this.swapButton.setActive(false);

        this.bombButton.switchActive();
        this.#logic.onBombPressed(this.bombButton.getActive(), _ => this.bombButton.boosterUsed());
    }

    _initGameObjects() {
        this._initLogic();
        this._initGameField();
    }

    _initGameField() {
        let components = [
            new DisplayObjectComponent(new Container(), this.screen),
            new GameFieldAnimatorComponent(this.#logic)
        ];

        this._gameField = new GameObject('GameField', components);
    }

    _initLogic() {
        let logicComponent = new BlastLogicComponent();
        // setupComponent.on('WIN', this.onWin.bind(this));
        // setupComponent.on('LOSE', this.onLose.bind(this));
        
        let components = [
            logicComponent
        ];

        this.#logic = logicComponent;

        new GameObject('Logic', components);
    }

    onWin() {
        this.emit(GameSession.SESSION_END, true);
    }

    onLose() {
        this.emit(GameSession.SESSION_END, false);
    }
}