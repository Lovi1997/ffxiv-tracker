const Content = require('./aSuper')

class Quest extends Content {
    constructor(oLogger) {
        super(oLogger);
        this._sContent = "Quest";
    }

    // Read number of Quests saved on local PC
    async getTotal() {
        if (Quest._iTotal === null) {
            // Retrieve
            this._oLogger.log("Retrieving total Number of Quests (Local)", 'I');
            this._oLogger.increaseDetLevel();
            Quest._iTotal = await super.getTotal();

            // Log
            this._oLogger.decreaseDetLevel();
            if (Quest._iTotal === null) {
                this._oLogger.log(`Error: Could not retrieve total Number of Quests (Local)`, 'E');
            };
        };

        // return
        return Quest._iTotal;
    }
}
module.exports = Quest;