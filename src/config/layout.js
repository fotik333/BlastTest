import { Button, TextButton, Timer, BoosterButton } from '../ui';
import { Text, TextStyle, Graphics, Container, TextInput } from 'pixi.js';
import { GlowFilter } from '@pixi/filter-glow';
import { createSprite } from '../utils/utils';
import GameSettings from '../GameSettings';

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
                createElement: () => new TextButton({ normal: 'panel1', hover: 'panel1', pressed: 'panel1' }, new Text('PLAY', new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 42 })), -50),
                events : [
                    { elementEvent: "pressed", exposeEvent: 'PLAY_BUTTON_PRESSED' }
                ],
                scale: 2,
                position: [WIDTH / 2, HEIGHT / 2 + 200],
                anchor: [.5, 1]
            },
            {
                name: 'SettingsButton',
                createElement: () => new TextButton({ normal: 'panel1', hover: 'panel1', pressed: 'panel1' }, new Text('SETTINGS', new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 42 })), -50),
                events : [
                    { elementEvent: "pressed", exposeEvent: 'SETTINGS_BUTTON_PRESSED' }
                ],
                scale: 2,
                position: [WIDTH / 2, HEIGHT / 2 - 100],
                anchor: [.5, 1]
            },
            {
                name: 'Settings',
                createElement: () => new Container,
                children: [
                    {
                        name: 'SizeX',
                        createElement: _ => new Container,
                        position: [400, 100],
                        children: [
                            {
                                name: 'SizeXLabel',
                                createElement: () => new Text('Size X: ', new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 70 })),
                                anchor: [1, .5],
                                position: [-150, -10],
                            },
                            {
                                name: 'SizeXDecreaseButton',
                                createElement: () => new TextButton({ normal: 'small_button' }, new Text('-', new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 90 })), -18),
                                scale: [.8, .8],
                                anchor: [.5, .5],
                                position: [-100, 0],
                                events : [
                                    { elementEvent: "pressed", exposeEvent: 'SIZE_X_DECREASE_BUTTON_PRESSED' }
                                ],
                            },
                            {
                                name: 'SizeXIncreaseButton',
                                createElement: () => new TextButton({ normal: 'small_button' }, new Text('+', new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 90 })), -18),
                                scale: [.8, .8],
                                anchor: [.5, .5],
                                position: [100, 0],
                                events : [
                                    { elementEvent: "pressed", exposeEvent: 'SIZE_X_DECREASE_BUTTON_PRESSED' }
                                ],
                            },
                            {
                                name: 'SizeX',
                                createElement: () => new Text(GameSettings.CurrentSettings.sizeX, new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 90 })),
                                anchor: [.5, .5],
                                position: [0, -10],
                            }
                        ]
                    }
                ]
            },
        ],
        events: {
            onPlayButtonPressed: 'PLAY_BUTTON_PRESSED',
            onSettingsButtonPressed: 'SETTINGS_BUTTON_PRESSED',
            onSizeXIncreased: 'SIZE_X_INCREASE_BUTTON_PRESSED',
            onSizeXDecreased: 'SIZE_X_DECREASE_BUTTON_PRESSED',
        },
    },
    gameScreen: {
        screenName: GAME_SCENE,
        children: [
            {
                name: 'ScoreField',
                layer: 'UI',
                createElement: () => createSprite({ texture: 'score_panel_bg'}),
                events: [
                    { elementEvent: "pressed", exposeEvent: 'BOMB_BUTTON_PRESSED' }
                ],
                anchor: [.5, .5],
                position: [1300, HEIGHT / 2 - 100],
            },
            {
                name: 'BoosterBombButton',
                layer: 'UI',
                createElement: () => new BoosterButton(
                    { normal: 'bonus_bg' },
                    new Text('Bomb', { fill: '#ffffff', fontSize: 60, fontFamily: 'LuckiestGuy' }),
                    -60,
                    new Text('5', { fill: '#ffffff', fontSize: 55, fontFamily: 'LuckiestGuy' }),
                    38
                ),
                events: [
                    { elementEvent: "pressed", exposeEvent: 'BOMB_BUTTON_PRESSED' }
                ],
                anchor: [.5, .5],
                position: [1150, HEIGHT - 150],
            },
            {
                name: 'BoosterSwapButton',
                layer: 'UI',
                createElement: () => new BoosterButton(
                    { normal: 'bonus_bg' },
                    new Text('Swap', { fill: '#ffffff', fontSize: 60, fontFamily: 'LuckiestGuy' }),
                    -60,
                    new Text('5', { fill: '#ffffff', fontSize: 55, fontFamily: 'LuckiestGuy' }),
                    38
                ),
                events: [
                    { elementEvent: "pressed", exposeEvent: 'SWAP_BUTTON_PRESSED' }
                ],
                anchor: [.5, .5],
                position: [1450, HEIGHT - 150],
            },
            {
                name: 'GameFieldBG',
                zIndex: -1,
                layer: 'UI',
                createElement: () => new Graphics
            },
        ],
        events: {
            onSwapButtonPressed: 'SWAP_BUTTON_PRESSED',
            onBombButtonPressed: 'BOMB_BUTTON_PRESSED',
        }
    },
    resultScreen: {
        screenName: RESULT_SCENE,
        children: [
            {
                name: 'RestartButton',
                createElement: () => new TextButton({ normal: 'panel1', hover: 'panel1', pressed: 'panel1' }, new Text('RESTART', new TextStyle({ fill: '#000099' })), -26),
                events: [
                    { elementEvent: "pressed", exposeEvent: 'RESTART_BUTTON_PRESSED' }
                ],
                scale: 2,
                position: [WIDTH / 2, HEIGHT / 2 - 110],
                anchor: [.5, 1]
            },
            {
                name: 'MenuButton',
                createElement: () => new TextButton({ normal: 'panel1', hover: 'panel1', pressed: 'panel1' }, new Text('MENU', new TextStyle({ fill: '#000099' })), -26),
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