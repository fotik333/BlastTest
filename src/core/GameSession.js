import GameWorld from "./GameWorld";
import { EventEmitter } from '@pixi/utils';

export default class GameSession extends EventEmitter {
    static SESSION_END = "SESSION_END";
    
    #screen;

    constructor(screen) {
        super();

        if (!screen || !screen.isScreen) {
            throw new Error(`${this.constructor.name} requires Screen`);
        }
        
        this.#screen = screen;
    }

    get screen() {
        return this.#screen;
    }

    inflate(config) {
        this.#screen.inflate(config);
    }

    start() {
        GameWorld.awake();
    }

    finish() {
        GameWorld.destroy();
    }
};