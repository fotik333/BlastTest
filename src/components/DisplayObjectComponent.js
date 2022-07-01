import Component from "../core/Component";

class DisplayObjectComponent extends Component {
    #displayObject;

    constructor(displayObject, parent) {
        super();
        
        this.#displayObject = displayObject;
        this.#displayObject.visible = false;

        parent.addChildAt(this.#displayObject, 0);
    }

    get displayObject() {
        return this.#displayObject;
    }

    onAwake() {
        this.onPositionSet();
        this.onRotationSet();
    }

    onEnable() {
        this.#displayObject.visible = true;
    }
    
    onDisable() {
        this.#displayObject.visible = false;
    }
    
    onDestroy() {
        this.#displayObject.destroy();
    }

    onPositionSet() {
        this.#displayObject.position.set(this.gameObject.transform.position.x, this.gameObject.transform.position.y);
    }

    onRotationSet() {
        this.#displayObject.rotation = this.gameObject.transform.rotation;
    }

    onScaleSet() {
        this.#displayObject.scale.set(this.gameObject.transform.scale.x, this.gameObject.transform.scale.y);
    }
}

export default DisplayObjectComponent;