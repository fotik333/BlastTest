import Screen from "../core/Screen";
import GameSettings from "../GameSettings";

class MenuScreen extends Screen {
    constructor(layoutConfig, gameSettings) {
        super(layoutConfig);

        let mainMenu = this.getChildByName('Main', true);
        let settingsMenu = this.getChildByName('Settings', true);

        this.on(this.layout.events.onSettingsButtonPressed, _ => {
            mainMenu.visible = false;
            settingsMenu.visible = true;
        });
        
        this.on(this.layout.events.onBackButtonPressed, _ => {
            mainMenu.visible = true;
            settingsMenu.visible = false;
        });
    
        
        this._initializeSettings(gameSettings);
    }

    _initializeSettings(gameSettings) {
        let sizeXText = this.getChildByName('SizeXText', true);
        sizeXText.text = gameSettings.sizeX;

        this.on(this.layout.events.onSizeXIncreased, _ => {
            gameSettings.sizeX = gameSettings.sizeX + 1;
            sizeXText.text = gameSettings.sizeX;
        });

        this.on(this.layout.events.onSizeXDecreased, _ => {
            gameSettings.sizeX = gameSettings.sizeX - 1;
            sizeXText.text = gameSettings.sizeX;
        });

        let sizeYText = this.getChildByName('SizeYText', true);
        sizeYText.text = gameSettings.sizeY;

        this.on(this.layout.events.onSizeYIncreased, _ => {
            gameSettings.sizeY = gameSettings.sizeY + 1;
            sizeYText.text = gameSettings.sizeY;
        });

        this.on(this.layout.events.onSizeYDecreased, _ => {
            console.log(gameSettings.sizeY)
            gameSettings.sizeY = gameSettings.sizeY - 1;
            sizeYText.text = gameSettings.sizeY;
        });

        let colorsText = this.getChildByName('ColorsText', true);
        colorsText.text = gameSettings.typesCount;

        this.on(this.layout.events.onColorsIncreased, _ => {
            gameSettings.typesCount = gameSettings.typesCount + 1;
            colorsText.text = gameSettings.typesCount;
        });

        this.on(this.layout.events.onColorsDecreased, _ => {
            gameSettings.typesCount = gameSettings.typesCount - 1;
            colorsText.text = gameSettings.typesCount;
        });

        let supertileGroupSizeText = this.getChildByName('SupertileGroupSizeText', true);
        supertileGroupSizeText.text = gameSettings.supertileMinGroupSize;

        this.on(this.layout.events.onSupertileGroupSizeIncreased, _ => {
            gameSettings.supertileMinGroupSize = gameSettings.supertileMinGroupSize + 1;
            supertileGroupSizeText.text = gameSettings.supertileMinGroupSize;
        });

        this.on(this.layout.events.onSupertileGroupSizeDecreased, _ => {
            gameSettings.supertileMinGroupSize = gameSettings.supertileMinGroupSize - 1;
            supertileGroupSizeText.text = gameSettings.supertileMinGroupSize;
        });

        let bombRadiusText = this.getChildByName('BombRadiusText', true);
        bombRadiusText.text = gameSettings.bombRadius;

        this.on(this.layout.events.onBombRadiusIncreased, _ => {
            gameSettings.bombRadius = gameSettings.bombRadius + 1;
            bombRadiusText.text = gameSettings.bombRadius;
        });

        this.on(this.layout.events.onBombRadiusDecreased, _ => {
            gameSettings.bombRadius = gameSettings.bombRadius - 1;
            bombRadiusText.text = gameSettings.bombRadius;
        });
    }
}

export default MenuScreen;