const { Logger, FileSystem } = require('../Util');

class Super {
    // Class Data
    static _oTotal = null

    // Instance Data
    _oFileSystem = {}
    _oLogger = {}
    _sPath = ""
    _sFileType = ""
    _sTotals = ""
    _sContent = ""
    _aItems = null

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
        if (Super._oTotal === null) {
            Super._oTotal = await this._get(this._sTotals, false);
        };
        return (Super._oTotal === null ? null : Super._oTotal[this._sContent]);
    }

    async getAll() {
        let aAll = await this._get(this._sContent, false);
        return aAll;
    }

    setData(aItems, iTotal) {
        this._aItems = aItems;
        Super._oTotal[this._sContent] = iTotal;
    }

    async save() {
        let bSuccess = await this._write(this._sContent, this._aItems, false);
        if (bSuccess === true) {
            bSuccess = await this._write(this._sTotals, Super._oTotal, false);
        };
        return bSuccess;
    }

    async _get(sFile, bLog) {
        // build path and read file
        let sPath = `${this._sPath}${sFile}${this._sFileType}`;

        var that = this;
        return this._oFileSystem.read(sPath, bLog)
            .then((oData) => {
                return oData;
            }).catch(() => {
                return null;
            });
    }

    async _write(sFile, oData, bLog) {
        // build path and write file
        let sPath = `${this._sPath}${sFile}${this._sFileType}`;

        var that = this;
        return this._oFileSystem.write(sPath, oData, bLog)
            .then((bSuccess) => {
                return bSuccess;
            });
    }
}
module.exports = Super;