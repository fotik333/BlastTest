class GameSettings {
    static CurrentSettings = {
        sizeX: 7,
        sizeY: 7,
        typesCount: 4,
        colors: [],
        minGroupSize: 2,
        useBomb: true,
        bombCount: 3,
        bombRadius: 3,
        useSwap: true,
        swapCount: 3,
        useSupertile: true,
        supertileMinGroupSize: 4,
        blendsMaxCount: 3,
        stepsCount: 3,
        stepsCount: 3
    };

    constructor() {
        this.initColors();
    }

    set sizeX(value) {
        GameSettings.CurrentSettings.sizeX = value;
    }

    initColors() {
		for (let i = 0; i < GameSettings.CurrentSettings.typesCount; i++) {
			GameSettings.CurrentSettings.colors.push(Math.random() * 0xaaaaaa + 0x555555);
		}
    }
}

export default GameSettings;