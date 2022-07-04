class StrategyResult {
    constructor(wasGameFieldUpdated, burnedTilesCount, stepDone) {
        this.wasGameFieldUpdated = wasGameFieldUpdated;
        this.burnedTilesCount = burnedTilesCount;
        this.stepDone = stepDone;
    }
}

export default StrategyResult;