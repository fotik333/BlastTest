import { TextButton, BoosterButton, ProgressBar } from '../ui';
import { Text, TextStyle, Graphics, Container } from 'pixi.js';
import { createSprite } from '../utils/utils';
import GameSettings from '../GameSettings';

const WIDTH = 1920;
const HEIGHT = 1080;

const MAX_FIELD_SIZE = 700;

const MENU_SCENE = "MENU";
const RESULT_SCENE = "RESULT";
const GAME_SCENE = "GAME";

const layoutConfig = {
    menuScreen: {
        screenName: MENU_SCENE,
        children: [
            {
                name: 'Main',
                createElement: _ => new Container,
                children: [
                    {
                        name: 'PlayButton',
                        createElement: () => new TextButton({ normal: 'panel1' }, new Text('PLAY', new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 42 })), -50),
                        events : [
                            { elementEvent: "pressed", exposeEvent: 'PLAY_BUTTON_PRESSED' }
                        ],
                        scale: 2,
                        position: [WIDTH / 2, HEIGHT / 2 + 200],
                        anchor: [.5, 1]
                    },
                    {
                        name: 'SettingsButton',
                        createElement: () => new TextButton({ normal: 'panel1' }, new Text('SETTINGS', new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 42 })), -50),
                        events : [
                            { elementEvent: "pressed", exposeEvent: 'SETTINGS_BUTTON_PRESSED' }
                        ],
                        scale: 2,
                        position: [WIDTH / 2, HEIGHT / 2 - 30],
                        anchor: [.5, 1]
                    },
                ]
            },
            {
                name: 'Settings',
                visible: false,
                createElement: () => new Container,
                children: [
                    {
                        name: 'SizeX',
                        createElement: _ => new Container,
                        position: [WIDTH / 2, 100],
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
                                    { elementEvent: "pressed", exposeEvent: 'SIZE_X_INCREASE_BUTTON_PRESSED' }
                                ],
                            },
                            {
                                name: 'SizeXText',
                                createElement: () => new Text(GameSettings.CurrentSettings.sizeX, new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 90 })),
                                anchor: [.5, .5],
                                position: [0, -10],
                            }
                        ]
                    },
                    {
                        name: 'SizeY',
                        createElement: _ => new Container,
                        position: [WIDTH / 2, 250],
                        children: [
                            {
                                name: 'SizeYLabel',
                                createElement: () => new Text('Size Y: ', new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 70 })),
                                anchor: [1, .5],
                                position: [-150, -10],
                            },
                            {
                                name: 'SizeYDecreaseButton',
                                createElement: () => new TextButton({ normal: 'small_button' }, new Text('-', new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 90 })), -18),
                                scale: [.8, .8],
                                anchor: [.5, .5],
                                position: [-100, 0],
                                events : [
                                    { elementEvent: "pressed", exposeEvent: 'SIZE_Y_DECREASE_BUTTON_PRESSED' }
                                ],
                            },
                            {
                                name: 'SizeYIncreaseButton',
                                createElement: () => new TextButton({ normal: 'small_button' }, new Text('+', new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 90 })), -18),
                                scale: [.8, .8],
                                anchor: [.5, .5],
                                position: [100, 0],
                                events : [
                                    { elementEvent: "pressed", exposeEvent: 'SIZE_Y_INCREASE_BUTTON_PRESSED' }
                                ],
                            },
                            {
                                name: 'SizeYText',
                                createElement: () => new Text(GameSettings.CurrentSettings.sizeX, new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 90 })),
                                anchor: [.5, .5],
                                position: [0, -10],
                            }
                        ]
                    },
                    {
                        name: 'Colors',
                        createElement: _ => new Container,
                        position: [WIDTH / 2, 400],
                        children: [
                            {
                                name: 'ColorsLabel',
                                createElement: () => new Text('Colors: ', new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 70 })),
                                anchor: [1, .5],
                                position: [-150, -10],
                            },
                            {
                                name: 'ColorsDecreaseButton',
                                createElement: () => new TextButton({ normal: 'small_button' }, new Text('-', new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 90 })), -18),
                                scale: [.8, .8],
                                anchor: [.5, .5],
                                position: [-100, 0],
                                events : [
                                    { elementEvent: "pressed", exposeEvent: 'COLORS_DECREASE_BUTTON_PRESSED' }
                                ],
                            },
                            {
                                name: 'ColorsIncreaseButton',
                                createElement: () => new TextButton({ normal: 'small_button' }, new Text('+', new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 90 })), -18),
                                scale: [.8, .8],
                                anchor: [.5, .5],
                                position: [100, 0],
                                events : [
                                    { elementEvent: "pressed", exposeEvent: 'COLORS_INCREASE_BUTTON_PRESSED' }
                                ],
                            },
                            {
                                name: 'ColorsText',
                                createElement: () => new Text(GameSettings.CurrentSettings.sizeX, new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 90 })),
                                anchor: [.5, .5],
                                position: [0, -10],
                            }
                        ]
                    },
                    {
                        name: 'SupertileGroupSize',
                        createElement: _ => new Container,
                        position: [WIDTH / 2, 550],
                        children: [
                            {
                                name: 'SupertileGroupSizeLabel',
                                createElement: () => new Text('Supertile\ngroup size', new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 50 })),
                                anchor: [1, .5],
                                position: [-165, -10],
                            },
                            {
                                name: 'SupertileGroupSizeDecreaseButton',
                                createElement: () => new TextButton({ normal: 'small_button' }, new Text('-', new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 90 })), -18),
                                scale: [.8, .8],
                                anchor: [.5, .5],
                                position: [-100, 0],
                                events : [
                                    { elementEvent: "pressed", exposeEvent: 'SUPERTILE_GROUP_SIZE_DECREASE_BUTTON_PRESSED' }
                                ],
                            },
                            {
                                name: 'SupertileGroupSizeIncreaseButton',
                                createElement: () => new TextButton({ normal: 'small_button' }, new Text('+', new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 90 })), -18),
                                scale: [.8, .8],
                                anchor: [.5, .5],
                                position: [100, 0],
                                events : [
                                    { elementEvent: "pressed", exposeEvent: 'SUPERTILE_GROUP_SIZE_INCREASE_BUTTON_PRESSED' }
                                ],
                            },
                            {
                                name: 'SupertileGroupSizeText',
                                createElement: () => new Text(GameSettings.CurrentSettings.sizeX, new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 90 })),
                                anchor: [.5, .5],
                                position: [0, -10],
                            }
                        ]
                    },
                    {
                        name: 'BombRadius',
                        createElement: _ => new Container,
                        position: [WIDTH / 2, 700],
                        children: [
                            {
                                name: 'BombRadiusLabel',
                                createElement: () => new Text('Bomb\nradius', new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 50 })),
                                anchor: [1, .5],
                                position: [-165, -10],
                            },
                            {
                                name: 'BombRadiusDecreaseButton',
                                createElement: () => new TextButton({ normal: 'small_button' }, new Text('-', new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 90 })), -18),
                                scale: [.8, .8],
                                anchor: [.5, .5],
                                position: [-100, 0],
                                events : [
                                    { elementEvent: "pressed", exposeEvent: 'BOMB_RADIUS_DECREASE_BUTTON_PRESSED' }
                                ],
                            },
                            {
                                name: 'BombRadiusIncreaseButton',
                                createElement: () => new TextButton({ normal: 'small_button' }, new Text('+', new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 90 })), -18),
                                scale: [.8, .8],
                                anchor: [.5, .5],
                                position: [100, 0],
                                events : [
                                    { elementEvent: "pressed", exposeEvent: 'BOMB_RADIUS_INCREASE_BUTTON_PRESSED' }
                                ],
                            },
                            {
                                name: 'BombRadiusText',
                                createElement: () => new Text(GameSettings.CurrentSettings.sizeX, new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 90 })),
                                anchor: [.5, .5],
                                position: [0, -10],
                            }
                        ]
                    },
                    {
                        name: 'StepsCount',
                        createElement: _ => new Container,
                        position: [WIDTH  - 300, HEIGHT / 2 - 200],
                        children: [
                            {
                                name: 'StepsCountLabel',
                                createElement: () => new Text('Steps', new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 90 })),
                                anchor: [1, .5],
                                position: [-165, -10],
                            },
                            {
                                name: 'StepsCountDecreaseButton',
                                createElement: () => new TextButton({ normal: 'small_button' }, new Text('-', new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 90 })), -18),
                                scale: [.8, .8],
                                anchor: [.5, .5],
                                position: [-100, 0],
                                events : [
                                    { elementEvent: "pressed", exposeEvent: 'STEPS_COUNT_DECREASE_BUTTON_PRESSED' }
                                ],
                            },
                            {
                                name: 'StepsCountIncreaseButton',
                                createElement: () => new TextButton({ normal: 'small_button' }, new Text('+', new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 90 })), -18),
                                scale: [.8, .8],
                                anchor: [.5, .5],
                                position: [100, 0],
                                events : [
                                    { elementEvent: "pressed", exposeEvent: 'STEPS_COUNT_INCREASE_BUTTON_PRESSED' }
                                ],
                            },
                            {
                                name: 'StepsCountText',
                                createElement: () => new Text(GameSettings.CurrentSettings.sizeX, new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 90 })),
                                anchor: [.5, .5],
                                position: [0, -10],
                            }
                        ]
                    },
                    {
                        name: 'ScoreGoal',
                        createElement: _ => new Container,
                        position: [WIDTH  - 300, HEIGHT / 2 - 50],
                        children: [
                            {
                                name: 'ScoreGoalLabel',
                                createElement: () => new Text('Goal', new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 90 })),
                                anchor: [1, .5],
                                position: [-220, -10],
                            },
                            {
                                name: 'ScoreGoalDecreaseButton',
                                createElement: () => new TextButton({ normal: 'small_button' }, new Text('-', new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 90 })), -18),
                                scale: [.8, .8],
                                anchor: [.5, .5],
                                position: [-150, 0],
                                events : [
                                    { elementEvent: "pressed", exposeEvent: 'GOAL_DECREASE_BUTTON_PRESSED' }
                                ],
                            },
                            {
                                name: 'ScoreGoalIncreaseButton',
                                createElement: () => new TextButton({ normal: 'small_button' }, new Text('+', new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 90 })), -18),
                                scale: [.8, .8],
                                anchor: [.5, .5],
                                position: [150, 0],
                                events : [
                                    { elementEvent: "pressed", exposeEvent: 'GOAL_INCREASE_BUTTON_PRESSED' }
                                ],
                            },
                            {
                                name: 'ScoreGoalText',
                                createElement: () => new Text('5000', new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 70 })),
                                anchor: [.5, .5],
                                position: [0, -10],
                            }
                        ]
                    },
                    {
                        name: 'BackButton',
                        createElement: () => new TextButton({ normal: 'panel1' }, new Text('BACK', new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 42 })), -50),
                        events : [
                            { elementEvent: "pressed", exposeEvent: 'BACK_BUTTON_PRESSED' }
                        ],
                        scale: 2,
                        position: [WIDTH / 2, 1000],
                        anchor: [.5, 1]
                    },
                ]
            },
        ],
        events: {
            onPlayButtonPressed: 'PLAY_BUTTON_PRESSED',
            onSettingsButtonPressed: 'SETTINGS_BUTTON_PRESSED',
            onBackButtonPressed: 'BACK_BUTTON_PRESSED',

            onSizeXIncreased: 'SIZE_X_INCREASE_BUTTON_PRESSED',
            onSizeXDecreased: 'SIZE_X_DECREASE_BUTTON_PRESSED',

            onSizeYIncreased: 'SIZE_Y_INCREASE_BUTTON_PRESSED',
            onSizeYDecreased: 'SIZE_Y_DECREASE_BUTTON_PRESSED',

            onColorsIncreased: 'COLORS_INCREASE_BUTTON_PRESSED',
            onColorsDecreased: 'COLORS_DECREASE_BUTTON_PRESSED',

            onColorsIncreased: 'COLORS_INCREASE_BUTTON_PRESSED',
            onColorsDecreased: 'COLORS_DECREASE_BUTTON_PRESSED',

            onSupertileGroupSizeIncreased: 'SUPERTILE_GROUP_SIZE_INCREASE_BUTTON_PRESSED',
            onSupertileGroupSizeDecreased: 'SUPERTILE_GROUP_SIZE_DECREASE_BUTTON_PRESSED',

            onBombRadiusIncreased: 'BOMB_RADIUS_INCREASE_BUTTON_PRESSED',
            onBombRadiusDecreased: 'BOMB_RADIUS_DECREASE_BUTTON_PRESSED',

            onStepsCountIncreased: 'STEPS_COUNT_INCREASE_BUTTON_PRESSED',
            onStepsCountDecreased: 'STEPS_COUNT_DECREASE_BUTTON_PRESSED',

            onGoalIncreased: 'GOAL_INCREASE_BUTTON_PRESSED',
            onGoalDecreased: 'GOAL_DECREASE_BUTTON_PRESSED',
        },
    },
    gameScreen: {
        screenName: GAME_SCENE,
        children: [
            {
                name: 'ProgressBar',
                createElement: _ => new ProgressBar,
                position: [500, 20],
            },
            {
                name: 'GoalContainer',
                createElement: _ => new Container,
                position: [1300, 100],
                children: [
                    {
                        name: 'GoalBG',
                        createElement: _ => createSprite({ texture: 'panel2'}),
                        anchor: [.5, .5],
                        position: [0, -18]
                    },
                    {
                        name: 'GoalLabel',
                        createElement: _ => new Text('GOAL:', { fill: '#0d233d', fontSize: 60, fontFamily: 'LuckiestGuy' }),
                        anchor: [1, .5],
                        position: [-140, -25]
                    },
                    {
                        name: 'GoalText',
                        createElement: _ => new Text('0', { fill: '#ffffff', fontSize: 60, fontFamily: 'LuckiestGuy' }),
                        anchor: [.5, .5],
                        position: [0, -25]
                    }
                ]
            },
            {
                name: 'ScoreField',
                createElement: () => createSprite({ texture: 'score_panel_bg'}),
                events: [
                    { elementEvent: "pressed", exposeEvent: 'BOMB_BUTTON_PRESSED' }
                ],
                anchor: [.5, .5],
                position: [1300, HEIGHT / 2 - 100],
                children: [
                    {
                        name: 'StepsCount',
                        createElement: _ => new Text('10', { fill: '#ffffff', fontSize: 150, fontFamily: 'LuckiestGuy' }),
                        anchor: [.5, .5],
                        position: [0, -125]
                    },
                    {
                        name: 'ScoreLabel',
                        createElement: _ => new Text('SCORE:', { fill: '#ffffff', fontSize: 60, fontFamily: 'LuckiestGuy' }),
                        anchor: [.5, .5],
                        position: [0, 85]
                    },
                    {
                        name: 'Score',
                        createElement: _ => new Text('0', { fill: '#ffffff', fontSize: 80, fontFamily: 'LuckiestGuy' }),
                        anchor: [.5, .5],
                        position: [0, 160]
                    }
                ]
            },
            {
                name: 'BoosterBombButton',
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
            {
                name: 'PauseScreen',
                visible: false,
                createElement: _ => new Container,
                children: [
                    {
                        name: 'PauseScreenBG',
                        createElement: _ => new Graphics().beginFill(0x000000, 0.5).drawRect(0, 0, WIDTH, HEIGHT).endFill(),
                        interactive: true,
                    },
                    {
                        name: 'PauseScreenMenuButton',
                        createElement: _ => new TextButton({ normal: 'panel1' }, new Text('MENU', new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 42 })), -7),
                        events : [
                            { elementEvent: "pressed", exposeEvent: 'PAUSE_MENU_BUTTON_PRESSED' }
                        ],
                        interactive: true,
                        scale: 2,
                        position: [WIDTH / 2, HEIGHT / 2],
                        anchor: [.5, .5]
                    }
                ]
            },
            {
                name: 'PauseButton',
                createElement: () => new TextButton({ normal: 'small_button' }, new Text('| |', new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 70 })), -15),
                events: [
                    { elementEvent: "pressed", exposeEvent: 'PAUSE_BUTTON_PRESSED' }
                ],
                position: [WIDTH - 100, 100],
                anchor: [.5, .5]
            },
        ],
        events: {
            onSwapButtonPressed: 'SWAP_BUTTON_PRESSED',
            onBombButtonPressed: 'BOMB_BUTTON_PRESSED',
            onPauseButtonPressed: 'PAUSE_BUTTON_PRESSED',
            onPauseMenuButtonPressed: 'PAUSE_MENU_BUTTON_PRESSED',
        }
    },
    resultScreen: {
        screenName: RESULT_SCENE,
        children: [
            {
                name: 'RestartButton',
                createElement: () => new TextButton({ normal: 'panel1' }, new Text('RESTART', new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 42 })), -50),
                events : [
                    { elementEvent: "pressed", exposeEvent: 'RESTART_BUTTON_PRESSED' }
                ],
                scale: 2,
                position: [WIDTH / 2, HEIGHT / 2 + 200],
                anchor: [.5, 1]
            },
            {
                name: 'MenuButton',
                createElement: () => new TextButton({ normal: 'panel1' }, new Text('MENU', new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 42 })), -50),
                events : [
                    { elementEvent: "pressed", exposeEvent: 'MENU_BUTTON_PRESSED' }
                ],
                scale: 2,
                position: [WIDTH / 2, HEIGHT / 2 - 30],
                anchor: [.5, 1]
            },
            {
                name: 'ResultText',
                createElement: () => new Text('', new TextStyle({ fill: '#ffffff', fontFamily: 'LuckiestGuy', fontSize: 150 })),
                position: [WIDTH / 2, 250],
                anchor: [.5, 1]
            },
        ],
        events: {
            onRestartButtonPressed: 'RESTART_BUTTON_PRESSED',
            onMenuButtonPressed: 'MENU_BUTTON_PRESSED'
        },
    },
};

export { layoutConfig, WIDTH, HEIGHT, MENU_SCENE, RESULT_SCENE, GAME_SCENE, MAX_FIELD_SIZE };