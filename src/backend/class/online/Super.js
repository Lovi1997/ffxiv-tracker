const { Downloader } = require("../Util");

class Super {
  _oDownloader = {};
  _sContentName = "";
  _aColumns = [];
  _sFilter = "";
  _sSortField = "";

  constructor() {
    this._oDownloader = new Downloader();
  }

  async getAll() {
    var aAll = await this._get(false, "getAll");
    return aAll;
  }

  async performSearch(sSearchString) {
    var aResult = await this._get(false, "search", sSearchString);
    return aResult;
  }

  async getWithFilter() {
    var aResult = await this._get(false, "filter");
    return aResult;
  }

  async _get(bLog, sMethod, iID) {
    // Initialize Get Parameters
    var { sContentName, aParams, sID } = this._getParams(sMethod, iID);

    // Call Downloader
    var that = this;
    var oResult = await this._oDownloader
      .download(sContentName, sID, aParams, bLog)
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
    var sContentName = this._sContentName;

    // Set Params and ID according to requested Method
    switch (sMethod) {
      case "getItem":
        sID = iID;
        break;
      case "search":
        aParams = [
          { name: "indexes", value: this._sContentName },
          { name: "string", value: iID },
          { name: "string_algo", value: "wildcard_plus" },
        ];
        sContentName = "search";
        break;
      case "filter":
        aParams = [
          { name: "indexes", value: this._sContentName },
          { name: "filters", value: this._sFilter },
          { name: "sort_field", value: this._sSortField },
          { name: "sort_order", value: "asc" },
        ];
        sContentName = "search";
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

    // Add limit
    aParams.push({ name: "limit", value: 3000 });

    // Add Language
    aParams.push({ name: "language", value: "de" });

    return { sContentName, aParams, sID };
  }
}
module.exports = Super;
