import { Ticker } from 'pixi.js';
import { CircleColliderComponent } from '../components';

class GameWorld {
    #isAwaken = false;
    gameObjects = [];

    awake() {
        Ticker.shared.add(this.tick, this);

        this.gameTime = 0;

        this.#isAwaken = true;

        this.gameObjects.forEach(go => {
            go.gameWorld = this;
            go.awake()
        });
    }

    destroy() {
        this.#isAwaken = false;
        Ticker.shared.remove(this.tick, this);
        this.gameObjects.forEach(go => go.destroy());
    }

    tick(dt) {
        this.gameObjects.forEach(go => go.tick(dt));
        
        //TODO
        // this.gameTime += dt * 1000 / 60;
        // // console.log(this.gameTime.toFixed(3));
        // TWEEN.update(this.gameTime);
    }

    findByName(name) {
        return this.gameObjects.filter(go => go.name === name);
    }
    
    findOneByName(name) {
        return this.gameObjects.find(go => go.name === name);
    }

    addGameObject(gameObject) {
        this.gameObjects.push(gameObject);
        if (this.#isAwaken) gameObject.awake();
    }

    removeGameObject(gameObject) {
        this.gameObjects = this.gameObjects.filter(go => go !== gameObject);
    }

    detectCollisions(position, radius, layer) {
        let collisions = [];

        this.gameObjects.forEach(go => {
            let collider = go.getComponent(CircleColliderComponent);
            
            if (collider && collider.layer === layer) {
                let goPosition = go.transform.position;
                let goRadius = collider.radius;

                let sqrDistance = (position.x - goPosition.x) * (position.x - goPosition.x) + (position.y - goPosition.y) * (position.y - goPosition.y);
                let sqrRadiusSum = (radius + goRadius) * (radius + goRadius);

                if (sqrDistance < sqrRadiusSum) {
                    collisions.push(go);
                }
            }
        });

        return collisions;
    }
}

export default new GameWorld;