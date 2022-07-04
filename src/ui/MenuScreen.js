import Screen from "../core/Screen";

class MenuScreen extends Screen {
    constructor(layoutConfig) {
        super(layoutConfig);

        this.initialize();
    }

    initialize() {
        
    }

    _findElementByName(root, name) {
        for (let i = 0; root.children && i < root.children.length; i++) {
            let element = root.children.find(child => child.name === name);
            if (element) return element;

            this._findElementByName(root.child[i], name);
        }

        return false;
    }
}

export default MenuScreen;