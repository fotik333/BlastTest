import { Container } from 'pixi.js';

class Screen extends Container {
    isScreen = true;

    #inflated = false;
    #layout;

    constructor(layoutConfig) {
        super();

        this.sortableChildren = true;
        if (layoutConfig) this.inflate(layoutConfig);
    }

    get layout() {
        return this.#layout;
    }

    inflate(layoutConfig) {
        if (this.#inflated) return;

        this.name = layoutConfig.screenName;

		layoutConfig.children.forEach(childConfig => {
            this._applyChild(childConfig, this);
		});
        
        this.#inflated = true;
        this.#layout = layoutConfig;
    }

    _applyChild(childConfig, parent) {
        let element = parent.addChild(childConfig.createElement());
        element.name = childConfig.name;
        childConfig.layer && (element.layer = childConfig.layer);

        if (childConfig.scale) {
            if (childConfig.scale.length) {
                element.scale.set(...childConfig.scale);
            } else {
                element.scale.set(childConfig.scale);
            }
        }

        if (childConfig.anchor) {
            if (childConfig.anchor.length) {
                element.anchor.set(...childConfig.anchor);
            } else {
                element.anchor.set(childConfig.anchor);
            }
        }

        childConfig.position && element.position.set(...childConfig.position);
        
        if (childConfig.zIndex !== undefined) element.zIndex = childConfig.zIndex;

        if (childConfig.interactive !== undefined) element.interactive = childConfig.interactive;

        if (childConfig.visible !== undefined) element.visible = childConfig.visible;

        if (childConfig.filters && childConfig.filters.length > 0) element.filters = childConfig.filters;

        childConfig.events && childConfig.events.forEach(event => {
            element.on(event.elementEvent, _ => this.emit(event.exposeEvent));
        });

        if (childConfig.children && childConfig.children.length > 0) {
            childConfig.children.forEach(config => this._applyChild(config, element));
        }
    }
}

export default Screen;