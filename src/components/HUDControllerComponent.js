import Component from "../core/Component";
import GameWorld from "../core/GameWorld";
import Game from '../Game';
import GameSettings from "../GameSettings";
import GameFieldComponent from "./GameFieldComponent";
import { Tween, Easing } from "@tweenjs/tween.js";
import GameFieldAnimatorComponent from "./GameFieldAnimatorComponent";

class HUDControllerComponent extends Component {
    static WIN = 'Win';
    static LOSE = 'Lose';
    static RETURN_TO_MENU = 'ReturnToMenu';

    #screen;
    #gameField;
    #gameFieldAnimator;

    #stepsText;
    #scoreText;
    #progressBar;

    #steps;
    #score = 0;

    #isLastStep = false;

    #pauseButton;
    #pauseScreen;
    #pauseMenuButton;

    #layout;
    
    constructor(screen, layout) {
        super();

        this.#screen = screen;
        this.#layout = layout;
    }

    onAwake() {
        let gameField = GameWorld.findOneByName('GameField');
        this.#gameField = gameField.getComponent(GameFieldComponent);
        this.#gameFieldAnimator = gameField.getComponent(GameFieldAnimatorComponent);

        this.#gameField.on(GameFieldComponent.STEP_DONE, this.onStepDone.bind(this));
        this.#gameField.on(GameFieldComponent.TILES_BURNED, this.onTilesBurned.bind(this));

        this.#steps = GameSettings.CurrentSettings.stepsCount;
        
        this.#stepsText = this.#screen.getChildByName('StepsCount', true);
        this.#stepsText.text = this.#steps;

        this.#scoreText = this.#screen.getChildByName('Score', true);
        this.#scoreText.text = this.#score;

        this.#progressBar = this.#screen.getChildByName('ProgressBar', true);
        this.#progressBar.setProgress(0);

        let goalText = this.#screen.getChildByName('GoalText', true);
        goalText.text = GameSettings.CurrentSettings.goal;

        this.#pauseButton = this.#screen.getChildByName('PauseButton', true);
        this.#screen.on(this.#layout.events.onPauseButtonPressed, this.onPausePressed.bind(this));

        this.#pauseScreen = this.#screen.getChildByName('PauseScreen', true);

        this.#pauseMenuButton = this.#screen.getChildByName('PauseMenuButton', true);
        this.#screen.on(this.#layout.events.onPauseMenuButtonPressed, this.onPauseMenuPressed.bind(this));
    }

    onPausePressed() {
        this.#pauseScreen.visible = !this.#pauseScreen.visible;
        PAUSED = this.#pauseScreen.visible;
    }

    onPauseMenuPressed() {
        PAUSED = false;
        this.emit(HUDControllerComponent.RETURN_TO_MENU);
        this.#pauseScreen.visible = false;
    }

    onStepDone() {
        this.#steps--;
        this.#stepsText.text = this.#steps;

        if (this.#steps === 0) this.#isLastStep = true;
    }

    onTilesBurned(count) {
        let scoreAdd = GameSettings.CurrentSettings.getScoreByCount(count);

        this.#scoreText.text = this.#score;

        let obj = { value: this.#score };

        new Tween(obj).to({ value: this.#score + scoreAdd }, 500)
            .onUpdate(_ => {
                this.#scoreText.text = Math.round(obj.value);
                this.#progressBar.setProgress(obj.value / GameSettings.CurrentSettings.goal);
            })
            .onComplete(_ => {
                this.#score += scoreAdd;

                this.#progressBar.setProgress(this.#score / GameSettings.CurrentSettings.goal);
                this.onScoreAdded();
            })
            .easing(Easing.Sinusoidal.In)
            .start();
    }

    async onScoreAdded() {
        if (this.#gameFieldAnimator.animationPlaying) {
            await new Promise(res => {
                let tween = new Tween(this).to({}, Infinity).onUpdate(_ => {
                    if (!this.#gameFieldAnimator.animationPlaying) {
                        tween.stop();
                        res();
                    }
                }).start();
            });
        }

        if (this.#score >= GameSettings.CurrentSettings.goal) {
            this.emit(HUDControllerComponent.WIN);
        } else if (this.#isLastStep) {
            this.emit(HUDControllerComponent.LOSE);
        }
    }

    onDestroy() {
        this.#gameField.off(GameFieldComponent.STEP_DONE, this.onStepDone.bind(this));
        this.#gameField.off(GameFieldComponent.TILES_BURNED, this.onTilesBurned.bind(this));
    }
}

export default HUDControllerComponent;