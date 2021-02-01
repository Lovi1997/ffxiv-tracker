const Super = require('../content/aSuper');
const Content = require('./aSuper')

class Quest extends Content {
    constructor(oLogger) {
        super(oLogger);
        this._sContent = "quest";
    }

    // Read number of Quests saved on local PC
    async getTotal() {
            // Retrieve
            this._oLogger.log("Retrieving total Number of Quests (Local)...", 'I');
            this._oLogger.increaseDetLevel();
            var iTotal = await super.getTotal();

            // Log
            this._oLogger.decreaseDetLevel();
            if (iTotal === null) {
                this._oLogger.log("Error: Could not retrieve total Number of Quests (Local).", 'E');
            };

        // return
        return iTotal;
    }

    // Read number of Quests saved on local PC
    async getAll() {
        if (this._aItems === null) {
            // Retrieve
            this._oLogger.log("Reading Local Quest Data...", 'I');
            this._oLogger.increaseDetLevel();
            this._aItems = await super.getAll();

            // Log
            this._oLogger.decreaseDetLevel();
            if (this._aItems === null) {
                this._oLogger.log("Error: Could not read local Quest Data.", 'E');
            };
        };

        // return
        return this._aItems;
    }

    async save() {
        // Retrieve
        this._oLogger.log("Saving Quest Data...", 'I');
        this._oLogger.increaseDetLevel();
        var bSuccess = await super.save();

        // Log
        this._oLogger.decreaseDetLevel();
        if (bSuccess === true) {
        } else {
            this._oLogger.log("Error: Could not save Quest Data.", 'E');
        };
        return bSuccess;
    }
}
module.exports = Quest;