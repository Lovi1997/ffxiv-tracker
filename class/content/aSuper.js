const { Logger } = require('../Util')

class Super {
        // Instance Data
        _oOnline = {}
        _oLocal  = {}
        _oLogger = {}

    constructor(oLogger) {
        // Create Logger if needed
        if (oLogger === undefined) {
            this._oLogger = new Logger();
        } else {
            this._oLogger = oLogger;
        };
    }

     // Read number of Quests saved on local PC
     async getTotalLocal() {
        let iNumber = await this._oLocal.getTotal();
        return iNumber
    }

    // get number of Quests currently on XIVAPI
    async getTotalOnline() {
        let iNumber = await this._oOnline.getTotal()
        return iNumber;
    }

    async update() {
        var aDataLocal    = [];
        var iPageTotal    = 0;
        var aDataNew      = [];
        var iPageCurrent  = 0;
        var iResultsTotal = 0;
        var bSuccess      = true;

        // Get Local Data
        aDataLocal = await this._oLocal.getAll();

        do {
            iPageCurrent++;

            // Get Page Content
            var oDataOnline = await this._oOnline.getPage(iPageCurrent, iPageTotal);

            // Step out of Loop if error
            if (oDataOnline === null){
                bSuccess = false;
                iPageCurrent = iPageTotal;
                break;
            };

            iPageTotal = oDataOnline.Pagination.PageTotal;
            iResultsTotal = oDataOnline.Pagination.ResultsTotal;

            // Search in local data and add if neccesarry
            oDataOnline.Results.forEach(function(oData) {
                // Only add real Objects
                if (oData.Name !== "") {
                    // Check for already Done
                    var oDataLocal = aDataLocal.find( x => x.ID === oData.ID);
                    if (oDataLocal === undefined) {
                        oData.Done = false;
                    } else {
                        oData.Done = oDataLocal.Done;
                    };
                    aDataNew.push(oData);
                };
            });
            oDataOnline = null;
        } while( iPageCurrent < iPageTotal );
        
        // Save Data in File
        if (bSuccess === true) {
            this._oLocal.setData(aDataNew, iResultsTotal);
            bSuccess = await this._oLocal.save(aDataNew);
            aDataNew = null;
        };
        return bSuccess;
    }

    _sleep(ms) {
        return new Promise(function(resolve) {
            setTimeout(resolve, ms);
        });
    }
}
module.exports = Super;