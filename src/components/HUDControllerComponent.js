import Component from "../core/Component";
import GameWorld from "../core/GameWorld";
import Game from '../Game';
import GameFieldComponent from "./GameFieldComponent";


class HUDControllerComponent extends Component {
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
    }

    onDestroy() {
    }
}

export default HUDControllerComponent;