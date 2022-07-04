class GameSettings {
    static CurrentSettings = {
        sizeX: 7,
        sizeY: 7,
        typesCount: 4,
        colors: [],
        minGroupSize: 2,

        bombRadius: 1,

        useSupertile: true,

        goal: 200,

        supertileMinGroupSize: 4,
        blendsMaxCount: 3,
        stepsCount: 10,

        getScoreByCount: count => {
            return count * count;
        }
    };

    constructor() {
        this.generateColors();
    }

    set stepsCount(value) {
        GameSettings.CurrentSettings.stepsCount = (value > 0 ? value : 1);
    }

    get stepsCount() {
        return GameSettings.CurrentSettings.stepsCount;
    }

    set goal(value) {
        GameSettings.CurrentSettings.goal = (value > 0 ? value : 10);
    }

    get goal() {
        return GameSettings.CurrentSettings.goal;
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