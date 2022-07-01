const CAPACITY_RESIZE = 1.5;

class Pool {
    #objects = [];
    #create = null;

    constructor(createFunc, amount) {
        this.#create = createFunc;
        this.addObjects(amount);
    }

    get elements() {
        return this.#objects;
    }

    clear() {
        this.#objects = [];
    }
    
    releaseAll() {
        this.#objects.forEach(object => this.release(object));
    }

    addObjects(amount) {
        for (let i = 0; i < amount; i++) {
            let object = this.#create();
            this.release(object);
            this.#objects.push(object);
            
            object.returnToPool = _ => this.release(object);
        }
    }

    getNext() {
        let object = this.#objects.find(object => object.inPool);

        if (object) {
            this.take(object);
            return object;
        }

        this.resize();
        return this.#objects.find(object => object.inPool);
    }

    resize() {
        this.addObjects(Math.floor(this.#objects.length * CAPACITY_RESIZE) - this.#objects.length);
    }

    take(object) {
        object.inPool = false;
    }

    release(object) {
        object.inPool = true;
    }
}

export default Pool;