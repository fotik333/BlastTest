import Component from "../core/Component";
import GameWorld from "../core/GameWorld";
import Game from '../Game';
import GameFieldComponent from "./GameFieldComponent";


class BoostersControllerComponent extends Component {
    #screen;
    #layout;
    #gameField;
    #buttons = [];
    #boostersCounters = {};
    
    constructor(screen, layout) {
        super();

        this.#screen = screen;
        this.#layout = layout;
    }

    onAwake() {
        this.#gameField = GameWorld.findOneByName('GameField').getComponent(GameFieldComponent);

        Game.boosters.forEach(data => {
            this.#boostersCounters[data.ID] = data.useCount;

            let button = this.#screen.getChildByName(data.buttonName);
            button.setCountText(data.useCount);
            this.#buttons.push(button);
            
            let buttonPressEvent = data.getButtonPressEvent(this.#layout);
            this.#screen.on(buttonPressEvent, this._onButtonPressed.bind(this, button, data.ID));
        });
    }

    _onButtonPressed(button, ID) {
        this._disableAllButtons(button);

        if (this.#boostersCounters[ID] <= 0) return;

        button.toggleActive();

        this.#gameField.enableStrategy(ID, button.getActive(), _ => {
            button.setActive(false);
            let currentUseCount = --this.#boostersCounters[ID];
            button.setCountText(currentUseCount);
        });
    }

    _disableAllButtons(exceptButton) {
        this.#buttons.filter(button => button !== exceptButton).forEach(b => b.setActive(false));
    }

    onDestroy() {
        this._disableAllButtons();

        this.#screen.removeAllListeners();
    }
}

export default BoostersControllerComponent;