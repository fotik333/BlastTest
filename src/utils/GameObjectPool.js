import Pool from './Pool';

class GameObjectPool extends Pool {
    take(object) {
        super.take(object);
        object.enable();
    }

    release(object) {
        super.release(object);
        object.disable();
    }
}

export default GameObjectPool;