import Component from "../core/Component";

const LAYERS = {
    asteroids: 0,
    rockets: 1
}

class CircleColliderComponent extends Component {
    #radius = 0;
    #layer = 0;

    constructor(radius, layer) {
        super();
        
        this.#radius = radius;
        this.#layer = layer;
    }

    get radius() {
        return this.#radius;
    }

    get layer() {
        return this.#layer;
    }
}

export { CircleColliderComponent, LAYERS };