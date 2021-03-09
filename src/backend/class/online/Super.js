const { Downloader } = require("../Util");

class Super {
  _oDownloader = {};
  _sContentName = "";
  _aColumns = [];
  _sFilter = "";
  _sSortField = "";

  constructor() {
    this._oDownloader = new Downloader();
    this._config = require("../../config/config.json");
  }

  async getAll() {
    var aAll = await this._get(false, "getAll");
    return aAll;
  }

  async performSearch(sSearchString) {
    var aResult = await this._get(false, "search", sSearchString);
    return aResult;
  }

  async getWithFilter(sFilterValue) {
    var aResult = await this._get(false, "filter", sFilterValue);
    return aResult;
  }

  async _get(bLog, sMethod, iID) {
    // Initialize Get Parameters
    var { sContentName, aParams, sID } = this._getParams(sMethod, iID);

    //
    var bComplete = false;
    var bError = false;

    var oQuests = { Total: 0, PageTotal: 0, Data: [] };
    var iPage = 1;

    while (bComplete === false) {
      var aParameters = [...aParams];
      aParameters.push({ name: "page", value: iPage });

      await this._oDownloader
        .download(sContentName, sID, aParameters, bLog)
        .then((oResult) => {
          oQuests.Total = oResult.Pagination.ResultsTotal;
          oQuests.PageTotal = oResult.Pagination.PageTotal;
          oResult.Results.forEach(function (oQuest) {
            oQuests.Data.push(oQuest);
          });
          if (iPage == oQuests.PageTotal || oQuests.PageTotal == 0) {
            bComplete = true;
          } else {
            ++iPage;
          }
        })
        .catch(() => {
          bError = true;
          bComplete = true;
        });
      if (bComplete === false) {
        await this._sleep();
      }
    }

    return bError === true ? null : oQuests.Data;
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
          { name: "filters", value: `${this._sFilter}=${iID}` },
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
    aParams.push({ name: "language", value: this._config.language });

    return { sContentName, aParams, sID };
  }

  _timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async _sleep() {
    await this._timeout(500);
    return null;
  }
}
module.exports = Super;
