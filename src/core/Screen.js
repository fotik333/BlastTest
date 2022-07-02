import { Container } from 'pixi.js';
import { layoutConfig } from '../config/layout';

class Screen extends Container {
    isScreen = true;

    #inflated = false;

    constructor(layoutConfig) {
        super();

        if (layoutConfig) this.inflate(layoutConfig);
    }

    inflate(layoutConfig) {
        if (this.#inflated) return;

        this.name = layoutConfig.screenName;

		layoutConfig.children.forEach(childConfig => {
			let element = this.addChild(childConfig.createElement());
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

            if (childConfig.visible !== undefined) element.visible = childConfig.visible;

            if (childConfig.filters && childConfig.filters.length > 0) element.filters = childConfig.filters;

            childConfig.events && childConfig.events.forEach(event => {
                element.on(event.elementEvent, _ => this.emit(event.exposeEvent));
            });
		});
        
        this.#inflated = true;
    }
}

export default Screen;