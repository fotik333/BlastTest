import { Container } from "@pixi/display";

export default class Timer extends Container {
    constructor(text) {
        super();

        this.text = this.addChild(text) ;
        this.visible = false;
    }

    setup(maxTime) {
        this.maxTime = maxTime;
        this.time = maxTime;
    }

    activate() {
        this.visible = true;

        this.interval = setInterval(this.tick.bind(this), 1000);
    }

    reset() {
        this.visible = false;

        this.stop();
        this.time = this.maxTime;
    }

    set time(value) {
        this._time = value;

        this.text.text = value;
    }

    get time() {
        return this._time;
    }

    stop() {
        clearInterval(this.interval);
        this.interval = null;
    }

    tick() {
        if (this.time === 0) {
            this.stop();
            this.emit('TIMER_END');
            return;
        }
        
        this.time = this.time - 1;
    }
}