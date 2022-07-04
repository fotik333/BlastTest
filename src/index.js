import * as PIXI from 'pixi.js-legacy';

import Game from './Game.js';
import { resourcesConfig } from './resouces';

const TWEEN = require('@tweenjs/tween.js');

global.PIXI = PIXI;
global.TWEEN = TWEEN;
global.PAUSED = false;

function animate(time) {
	requestAnimationFrame(animate);

	if (!PAUSED) {
		TWEEN.update(time);
	}
}

requestAnimationFrame(animate);

global.waiter = async time => new Promise(res => new TWEEN.Tween({}).to({}, time).start().onComplete(res));

const init = _ => {
	const app = new PIXI.Application({
		width: 1920,
		height: 1080,
		resolution: 2,
		resizeTo: window
	});

	async function setup(_, resources) {
		for (let name in resources) {
			if (!resources[name].texture || !resources[name].texture.baseTexture) continue;

			let config = resourcesConfig.find(config => config.name === name);

			if (!config.atlas) continue;

			let spritesheet = new PIXI.Spritesheet(resources[name].texture.baseTexture, require(`../build/assets/${config.atlas}`));
			spritesheet.parse(_ => {});
		}

		document.body.appendChild(app.view);
		app.stage.addChild(new Game());
		resize();
	}

	window.onresize = resize;

	function resize() {
		let w = window.getSize().width;
		let h = window.getSize().height;

		app.renderer.view.style.width = w + "px";
		app.renderer.view.style.height = h + "px";
	
		app.renderer.resize(w, h);
	
		if (app.background) {
			app.background.width = w;
			app.background.height = h;
		}

		app.stage && app.stage.children && app.stage.children.forEach(child => child.resize && child.resize());
	}

	resourcesConfig.forEach(asset => app.loader.add(asset.name, require(`../build/assets/${asset.path}`).default));
	app.loader.load(setup);
};

init();

(function visibilityChange() {
	let hidden = 'hidden'

	if (hidden in document)
		document.addEventListener('visibilitychange', onchange)
	else if ((hidden = 'mozHidden') in document)
		document.addEventListener('mozvisibilitychange', onchange)
	else if ((hidden = 'webkitHidden') in document)
		document.addEventListener('webkitvisibilitychange', onchange)
	else if ((hidden = 'msHidden') in document)
		document.addEventListener('msvisibilitychange', onchange)
	else if ('onfocusin' in document)
		document.onfocusin = document.onfocusout = onchange
	else
		window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange

	function onchange(evt) {
		let v = false,
			h = true,
			evtMap = {
				focus: v,
				focusin: v,
				pageshow: v,
				blur: h,
				focusout: h,
				pagehide: h
			};

		evt = evt || window.event

		let windowHidden = false;

		if (evt.type in evtMap) {
			windowHidden = evtMap[evt.type];
		} else {
			windowHidden = this[hidden];
		}

		try {
			if (windowHidden) {
				Howler.mute(true);
			} else {
				Howler.mute(false);
			}

			if (params.disableSounds) Howler.mute(true);
		} catch(e) {

		}
	}

	if (document[hidden] !== undefined) {
		onchange({ type: document[hidden] ? 'blur' : 'focus' });
	}
})();