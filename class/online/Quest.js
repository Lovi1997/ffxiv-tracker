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
            this._oLogger.log(`Error: Could not retrieve total Number of Quests (XIVAPI)...`, 'E');
        };

        // return
        return iTotal;
    }

    // Page Content
    async getPage(iID, iOf) {
        var iTotal = await super.getTotal();
        // Retrieve
        this._oLogger.log(`Retrieving Quest Content: Page: ${iID}${iOf === 0 ? "/?" : `/${iOf}`}, MaxItemsPerPage: 1100, TotalNumberOfItems: ${iTotal}`, 'I');
        this._oLogger.increaseDetLevel();
        var oPage = await super.getPage(iID);

        // Log
        this._oLogger.decreaseDetLevel();
        if(oPage === null) {
            this._oLogger.log(`Error: Could not retrieve Quest Content.`, 'E');
        };

        // return
        return oPage;
    }
}
module.exports = Quest;