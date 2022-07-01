import Component from "../core/Component";

class TransformComponent extends Component {
    #position = { x: 0, y: 0 };
    #rotation = 0;
    #scale = { x: 1, y: 1 };

    set position(position) {
        this.#position = position;
        this.gameObject && this.gameObject.onPositionSet();
    }
    
    set rotation(angle) {
        this.#rotation = angle;
        this.gameObject && this.gameObject.onRotationSet();
    }
    
    set scale(scale) {
        this.#scale = scale;
        this.gameObject && this.gameObject.onScaleSet();
    }

    get position() {
        return this.#position;
    }
    
    get rotation() {
        return this.#rotation;
    }
    
    get scale() {
        return this.#scale;
    }
}

export default TransformComponent;