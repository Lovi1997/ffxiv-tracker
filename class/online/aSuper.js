const { Downloader, Logger } = require('../Util');

class Super {
    // Instance Data
    _oDownloader = {}
    _oLogger     = {}
    _sContent    = ""

    constructor(oLogger) {
        // Create Logger if needed
        if (oLogger === undefined) {
            this._oLogger = new Logger();
        } else {
            this._oLogger = oLogger;
        };

        this._oDownloader = new Downloader(this._oLogger);
    }

    // Get Total Number of Items
    async getTotal() {
        var iTotal = await this._get(false, "Total");
        return iTotal;
    }

    async getPage(iID) {
        var oPage = await this._get(false, "Page", iID);
        return oPage;
    }

    // Do single Request to XIVAPI for given ContentID
    async _get(bLog, sContentName, iID) {
        // Initialize Get Parameters
        var { aParams, sID} = this._getParams(sContentName, iID);

        // Call Downloader
        var that = this;
        var oResult = await this._oDownloader.download(this._sContent, sID, aParams, bLog)
            .then((oData) => {
                return that._onSuccess(oData, sContentName);
            }).catch(() => {
                return that._onError();
            });

        // Give Back either null (if error) or the corresponding content Item
        return oResult;
    }

    _onSuccess(oData, sContentName) {
        var oResult = {};
        switch (sContentName) {
            case "Total":
                oResult = oData.Pagination.ResultsTotal;
                break;
            default:
                oResult = oData;
                break;
        };
        return oResult;
    }

    _onError() {
        return null;
    }

    _getParams(sContentName, iID) {
        // Initialize Get Parameters
        var aParams = [];
        var sID = "";

        // Distinguish in ID
        switch (sContentName) {
            case "Item":
                sID = iID;
                break;
            // Page additionally needs to now, which page it wants -> iID
            case "Page":
                aParams = [{name: "page",value: iID}, {name: "limit",value: 1100}];
                break;
            // Cant specify ID for URL (e.g. sContentName = Total)
            default:
                break;
        }
        return { aParams, sID };
    }
}
module.exports = Super;