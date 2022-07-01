import { EventEmitter } from '@pixi/utils';

class Component extends EventEmitter {
    gameObject;

    onAwake() {}
    onDestroy() {}
    onEnable() {}
    onDisable() {}
    tick(dt) {}
    onPositionSet() {}
    onRotationSet() {}
    onScaleSet() {}
}

export default Component;