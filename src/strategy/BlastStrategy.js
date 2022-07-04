class BlastStrategy {
    
    #gameField;

    get gameField() {
        return this.#gameField;
    }

    initialize(gameField) {
        this.#gameField = gameField;
    }

    onSelected() {}
    onDeselected() {}

    onTilePressed(tileId) {}
};

export default BlastStrategy;