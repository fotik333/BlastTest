import { Container, Graphics } from 'pixi.js';
import Screen from './core/Screen';
import { layoutConfig, HEIGHT, WIDTH, MENU_SCENE, RESULT_SCENE, GAME_SCENE } from './config/layout';
import BlastGameSession from './game/BlastGameSession';
import GameSession from "./core/GameSession";
import { createSprite } from './utils/utils.js';
import { BombBlastStrategy, SwapBlastStrategy, DefaultBlastStrategy } from './strategy';
import GameSettings from './GameSettings';
import MenuScreen from './ui/MenuScreen';

//TODO fix group imports
//TODO rename events

class Game extends Container {
	static strategies = [
		{
			ID: 'Default',
			strategy: new DefaultBlastStrategy,
		},
		{
			ID: 'Bomb',
			strategy: new BombBlastStrategy,
		},
		{
			ID: 'Swap',
			strategy: new SwapBlastStrategy,
		}
	];

	static boosters = [
        {
			ID: 'Bomb',
			buttonName: 'BoosterBombButton',
			getButtonPressEvent: (layout) => layout.events.onBombButtonPressed, 
			useCount: 5
		},
        {
			ID: 'Swap',
			buttonName: 'BoosterSwapButton',
			getButtonPressEvent: (layout) => layout.events.onSwapButtonPressed,
			useCount: 5
		}
    ];

	constructor() {
		super();

		// this.addChild(createSprite({ texture: 'background', width: WIDTH, height: HEIGHT}));
		//56ccc6
		this.addChild(new Graphics().beginFill(0x56ccc6, 1).drawRect(0, 0, WIDTH, HEIGHT).endFill());
		this.mask = this.addChild(new Graphics().beginFill(0xff0000, 0.5).drawRect(0, 0, WIDTH, HEIGHT).endFill());

		this._initScenes();

		this._switchScreen(MENU_SCENE);
	}

	_initScenes() {
		let gameSettings = new GameSettings;

		//TODO menu scene
		this._menuScreen = this.addChild(new MenuScreen(layoutConfig.menuScreen, gameSettings));
        this._menuScreen.on(layoutConfig.menuScreen.events.onPlayButtonPressed, this._onPlayButtonPressed.bind(this));

		this._resultScreen = this.addChild(new Screen(layoutConfig.resultScreen));
        this._resultScreen.on(layoutConfig.resultScreen.events.onMenuButtonPressed, this._onMenuButtonPressed.bind(this));
        this._resultScreen.on(layoutConfig.resultScreen.events.onRestartButtonPressed, this._onRestartButtonPressed.bind(this));

		this._gameScreen = this.addChild(new Screen());

		//TODO transition
	}

	_switchScreen(screenName) {
		this.children.forEach(child => {
			if (!child.isScreen) return;

			child.visible = child.name === screenName;
		});
	}

	_selectGameSession() {
		return new BlastGameSession(this._gameScreen);
	}

	_startGameSession() {
		this._gameSession = this._selectGameSession();

		this._switchScreen(GAME_SCENE);

		this._gameSession.on(GameSession.SESSION_END, this._finishGameSession.bind(this));
		this._gameSession.start();
	}

	_finishGameSession(isWin) {
		//TODO restart
		this._gameSession.finish();
		
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