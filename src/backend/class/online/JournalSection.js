const { Downloader } = require("../Util");

class JournalSection {
  _oDownloader = {};
  _sContentName = "";
  _aColumns = [];

  constructor() {
    this._sContentName = "JournalSection";
    this._oDownloader = new Downloader();
    this._aColumns = ["ID", "Name"];
  }

  async getAll() {
    var aAll = await this._get(false, "getAll");
    return aAll;
  }

  async _get(bLog, sMethod, iID) {
    // Initialize Get Parameters
    var { aParams, sID } = this._getParams(sMethod, iID);

    // Call Downloader
    var that = this;
    var oResult = await this._oDownloader
      .download(this._sContentName, sID, aParams, bLog)
      .then((oData) => {
        return that._onSuccess(oData, sMethod);
      })
      .catch(() => {
        return that._onError();
      });

    // Give Back either null (if error) or the corresponding content Item
    return oResult;
  }

  _onSuccess(oData, sMethod) {
    var oResult = {};
    switch (sMethod) {
      default:
        oResult = oData.Results;
        break;
    }
    return oResult;
  }

  _onError() {
    return null;
  }

  _getParams(sMethod, iID) {
    // Initialize Get Parameters
    var aParams = [];
    var sID = "";

    // Set Params and ID according to requested Method
    switch (sMethod) {
      case "getItem":
        sID = iID;
        break;
      case "getPage":
        aParams = [
          { name: "page", value: iID },
          { name: "limit", value: 1100 },
        ];
        break;
      default:
        break;
    }

    // Set requested columns
    var sColumns = "";
    this._aColumns.forEach((sColumn) => {
      sColumns = `${sColumns}${sColumns === "" ? "" : ","}${sColumn}`;
    });

    // Add Columns to Parameters
    aParams.push({
      name: "columns",
      value: sColumns,
    });

    // Add Language
    aParams.push({ name: "language", value: "de" });

    return { aParams, sID };
  }
}

module.exports = JournalSection;
