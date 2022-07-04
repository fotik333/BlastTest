class GameSettings {
    static CurrentSettings = {
        sizeX: 7,
        sizeY: 7,
        typesCount: 4,
        colors: [],
        minGroupSize: 2,

        bombRadius: 3,

        useSupertile: true,

        supertileMinGroupSize: 4,
        blendsMaxCount: 3,
        stepsCount: 3
    };

    constructor() {
        this.generateColors();
    }

    set bombRadius(value) {
        GameSettings.CurrentSettings.bombRadius = (value > 2 ? value : 2);
    }

    get bombRadius() {
        return GameSettings.CurrentSettings.bombRadius;
    }


    set supertileMinGroupSize(value) {
        GameSettings.CurrentSettings.supertileMinGroupSize = (value > 3 ? value : 3);
    }

    get supertileMinGroupSize() {
        return GameSettings.CurrentSettings.supertileMinGroupSize;
    }

    set typesCount(value) {
        GameSettings.CurrentSettings.typesCount = (value > 3 ? value : 3);
        this.generateColors();
    }

    get typesCount() {
        return GameSettings.CurrentSettings.typesCount;
    }

    set sizeX(value) {
        GameSettings.CurrentSettings.sizeX = (value > 3 ? value : 3);
    }

    get sizeX() {
        return GameSettings.CurrentSettings.sizeX;
    }

    set sizeY(value) {
        GameSettings.CurrentSettings.sizeY = (value > 3 ? value : 3);
    }

    get sizeY() {
        return GameSettings.CurrentSettings.sizeY;
    }

    generateColors() {
		for (let i = 0; i < GameSettings.CurrentSettings.typesCount; i++) {
			GameSettings.CurrentSettings.colors.push(Math.random() * 0xaaaaaa + 0x555555);
		}
    }
}

export default GameSettings;