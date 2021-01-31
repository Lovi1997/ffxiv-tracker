const { Logger, FileSystem } = require('../Util');

class Super {
    // Class Data
    static _iTotal = null;
    static _aItems = [];

    // Instance Data
    _oFileSystem = {}
    _oLogger = {}
    _sPath = ""
    _sFileType = ""
    _sTotals = ""
    _sContent = ""

    constructor(oLogger) {
        // Create FileSystem, Logger
        if (oLogger === undefined) {
            this._oLogger = new Logger();
        } else {
            this._oLogger = oLogger;
        };
        this._oFileSystem = new FileSystem(this._oLogger);

        // set Paths
        this._sPath = './data/';
        this._sFileType = '.json';
        this._sTotals = "total";
    }

    // Read number of Quests saved on local PC
    async getTotal() {
        let iTotal = await this._get(this._sTotals, false)
        return iTotal;
    }

    async _get(sFile, bLog) {
        // build path and read file
        let sPath = `${this._sPath}${sFile}${this._sFileType}`;

        var that = this;
        return this._oFileSystem.read(sPath, bLog)
            .then((oData) => {
                return that._onSuccess(oData, sFile);
            }).catch(() => {
                return that._onError();
            });
    }

    _onSuccess(oData, sFile) {
        var oResult = {};
        switch(sFile) {
            case "total":
                oResult = oData[this._sContent];
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
}
module.exports = Super;