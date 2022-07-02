import { InputManager } from "./ui";
import { Sprite, Container, Graphics } from 'pixi.js';
import Screen from './core/Screen';
import { layoutConfig, HEIGHT, WIDTH, MENU_SCENE, RESULT_SCENE, GAME_SCENE } from './config/layout';
import gameConfig from './config/gameConfig.json';
import BlastGameSession from './game/BlastGameSession';
import GameSession from "./core/GameSession";
import { createSprite } from './utils/utils.js';

class Game extends Container {
	static sizeX = 3;
	static sizeY = 3;
	static typesCount = 9;
	static colors = [];
	static minGroupSize = 2;

	static useBomb = true;
	static bombCount = 3;
	static bombRadius = 2;

	static useSwap = true;
	static swapCount = 3;

	static useSupertile = true;
	static supertileMinGroupSize = 4;
	static blendsMaxCount = 3;

	constructor() {
		super();

		for (let i = 0; i < Game.typesCount; i++) {
			Game.colors.push(Math.random() * 0xaaaaaa + 0x555555);
		}

		this.addChild(createSprite({ texture: 'background', width: WIDTH, height: HEIGHT}));
		this.mask = this.addChild(new Graphics().beginFill(0xff0000, 0.5).drawRect(0, 0, WIDTH, HEIGHT).endFill());

		this._initScenes();

		this._switchScreen(MENU_SCENE);
	}

	_initScenes() {
		this._menuScreen = this.addChild(new Screen(layoutConfig.menuScreen));
        this._menuScreen.on(layoutConfig.menuScreen.events.onPlayButtonPressed, this._onPlayButtonPressed.bind(this));

		this._resultScreen = this.addChild(new Screen(layoutConfig.resultScreen));
        this._resultScreen.on(layoutConfig.resultScreen.events.onMenuButtonPressed, this._onMenuButtonPressed.bind(this));
        this._resultScreen.on(layoutConfig.resultScreen.events.onRestartButtonPressed, this._onRestartButtonPressed.bind(this));

		this._gameScreen = this.addChild(new Screen());
	}

	_switchScreen(screenName) {
		this.children.forEach(child => {
			if (!child.isScreen) return;

			child.visible = child.name === screenName;
		});
	}

	_selectGameSession() {
		return new BlastGameSession(this._gameScreen, gameConfig);
	}

	_startGameSession() {
		this._gameSession = this._selectGameSession();

		this._switchScreen(GAME_SCENE);

		InputManager.enable();

		this._gameSession.on(GameSession.SESSION_END, this._finishGameSession.bind(this));
		this._gameSession.start();
	}

	_finishGameSession(isWin) {
		this._gameSession.finish();
		InputManager.disable();
		
		this._gameSession.off(GameSession.SESSION_END, this._finishGameSession.bind(this));
		this._resultScreen.getChildByName('ResultText').text = `YOU ${isWin ? 'WIN' : 'LOSE'}`;
		this._switchScreen(RESULT_SCENE);
	}

	_onMenuButtonPressed() {
		this._switchScreen(MENU_SCENE);
	}

    _onRestartButtonPressed() {
		this._startGameSession();
    }

    _onPlayButtonPressed() {
		this._startGameSession();
    }

	destroy() {
		this._gameSession.finish();
	}

	resize() {
		let width = window.getSize().width;
		let height = window.getSize().height;
		
		this.scale.set(width / WIDTH);
		this.position.y = height / 2 - HEIGHT * this.scale.x / 2;
	}
}

export default Game;