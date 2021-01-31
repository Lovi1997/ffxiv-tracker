const Content = require('./aSuper');

class Quest extends Content {
    // Create with Content Object with ID "Quest"
    constructor(oLogger) {
        super(oLogger);
        this._sContent = "Quest";
    }

    // Get Total Number of Quests
    async getTotal() {
        // Retrieve
        this._oLogger.log("Retrieving total Number of Quests (XIVAPI)", 'I');
        this._oLogger.increaseDetLevel();
        var iTotal = await super.getTotal();

        // Log
        this._oLogger.decreaseDetLevel();
        if(iTotal === null) {
            this._oLogger.log(`Error: Could not retrieve total Number of Quests (XIVAPI)`, 'E');
        };

        // return
        return iTotal;
    }
}
module.exports = Quest;