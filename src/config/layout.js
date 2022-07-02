import { Button, TextButton, Timer, BoosterButton } from '../ui';
import { Text, TextStyle } from 'pixi.js';
import { GlowFilter } from '@pixi/filter-glow';

const WIDTH = 1920;
const HEIGHT = 1080;

const MENU_SCENE = "MENU";
const RESULT_SCENE = "RESULT";
const GAME_SCENE = "GAME";

const layoutConfig = {
    menuScreen: {
        screenName: MENU_SCENE,
        children: [
            {
                name: 'PlayButton',
                createElement: () => new TextButton({ normal: 'btn_normal', hover: 'btn_hover', pressed: 'btn_pressed' }, new Text('PLAY', new TextStyle({ fill: '#000099' })), -26),
                events : [
                    { elementEvent: "pressed", exposeEvent: 'PLAY_BUTTON_PRESSED' }
                ],
                scale: 2,
                position: [WIDTH / 2, HEIGHT / 2 + 250],
                anchor: [.5, 1]
            },
        ],
        events: {
            onPlayButtonPressed: 'PLAY_BUTTON_PRESSED'
        },
    },
    gameScreen: {
        screenName: GAME_SCENE,
        children: [
            {
                name: 'Timer',
                layer: 'UI',
                createElement: () => new Timer(new Text('', new TextStyle({ fill: '#555599', fontSize: 80 }))),
                events : [
                    { elementEvent: "TIMER_END", exposeEvent: 'TIMER_END' }
                ],
                position: [30, 30],
            },
            {
                name: 'BoosterBombButton',
                layer: 'UI',
                createElement: () => new BoosterButton({ normal: 'bonus_bg' }, new Text('Bomb', { fontSize: 90 }), -100, new Text('5', { fontSize: 80 }), 100),
                events: [
                    { elementEvent: "pressed", exposeEvent: 'BOMB_BUTTON_PRESSED' }
                ],
                anchor: [.5, .5],
                position: [WIDTH - 200, 200],
            },
            {
                name: 'BoosterSwapButton',
                layer: 'UI',
                createElement: () => new BoosterButton({ normal: 'bonus_bg' }, new Text('Swap', { fontSize: 90 }), -100, new Text('5', { fontSize: 80 }), 100),
                events: [
                    { elementEvent: "pressed", exposeEvent: 'SWAP_BUTTON_PRESSED' }
                ],
                anchor: [.5, .5],
                position: [WIDTH - 200, 600],
            },
        ],
        events: {
            onSwapButtonPressed: 'SWAP_BUTTON_PRESSED',
            onBombButtonPressed: 'BOMB_BUTTON_PRESSED',
            onTimerEnd: 'TIMER_END'
        }
    },
    resultScreen: {
        screenName: RESULT_SCENE,
        children: [
            {
                name: 'RestartButton',
                createElement: () => new TextButton({ normal: 'btn_normal', hover: 'btn_hover', pressed: 'btn_pressed' }, new Text('RESTART', new TextStyle({ fill: '#000099' })), -26),
                events: [
                    { elementEvent: "pressed", exposeEvent: 'RESTART_BUTTON_PRESSED' }
                ],
                scale: 2,
                position: [WIDTH / 2, HEIGHT / 2 - 110],
                anchor: [.5, 1]
            },
            {
                name: 'MenuButton',
                createElement: () => new TextButton({ normal: 'btn_normal', hover: 'btn_hover', pressed: 'btn_pressed' }, new Text('MENU', new TextStyle({ fill: '#000099' })), -26),
                events: [
                    { elementEvent: "pressed", exposeEvent: 'MENU_BUTTON_PRESSED' }
                ],
                scale: 2,
                position: [WIDTH / 2, HEIGHT / 2 + 190],
                anchor: [.5, 1]
            },
            {
                name: 'ResultText',
                createElement: () => new Text('XYU', new TextStyle({ fill: '#5555ff', fontSize: 80 })),
                position: [WIDTH / 2, HEIGHT / 2],
                anchor: [.5, .5]
            },
        ],
        events: {
            onRestartButtonPressed: 'RESTART_BUTTON_PRESSED',
            onMenuButtonPressed: 'MENU_BUTTON_PRESSED'
        },
    },
};

export { layoutConfig, WIDTH, HEIGHT, MENU_SCENE, RESULT_SCENE, GAME_SCENE };