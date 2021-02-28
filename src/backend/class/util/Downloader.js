const Logger = require("./Logger");
const request = require("request");

class Downloader {
  // Class Data
  static sHost = "https://xivapi.com/";

  // Instance Data
  _oLogger = {};
  _oRequest = {};

  constructor(oLogger) {
    // Create Logger if needed
    if (oLogger === undefined) {
      this._oLogger = new Logger();
    } else {
      this._oLogger = oLogger;
    }
    this._oRequest = request;
  }

  // download from XIVAPI
  download(sPath, iID, aParams, bLog) {
    // Create Promise for async processing
    var that = this;
    return new Promise(function (resolve, reject) {
      return that._onDownload(resolve, reject, sPath, iID, aParams, bLog);
    });
  }

  _onDownload(resolve, reject, sPath, iID, aParams, bLog) {
    // get URL Params and build URL for HTTP Request
    let sURLParam = this._getURLParamString(aParams);
    let sURL = `${Downloader.sHost}${sPath}/${iID}${sURLParam}`;
    console.log(sURL);

    // Log Info
    this._oLogger.log(`Download: ${sURL}`, "I");

    // Do HTTP Request (GET)
    var that = this;
    this._oRequest(sURL, function (error, response, body) {
      that._onReceived(resolve, reject, error, response, body, bLog);
    });
  }

  _onReceived(resolve, reject, error, response, body, bLog) {
    if (error) {
      // Log StatusCode and Error
      if (response) {
        this._oLogger.log(`StatusCode: ${response.statusCode}`, "E");
      }
      this._oLogger.log(`Message: ${error}`, "E");
      // Reject Promise to trigger error fallback
      reject();
    } else {
      // Log Success Message
      if (bLog === true) {
        this._oLogger.log(`StatusCode: ${response.statusCode}`, "I");
        this._oLogger.log("Message: Request successful.", "I");
      }
      // Resolve and return response data
      resolve(JSON.parse(body));
    }
  }

  _getURLParamString(aParams) {
    // Initialize for empty case
    var sParamString = "";

    // Loop over Params and build String
    aParams.forEach(function (oParam) {
      sParamString = `${sParamString}${oParam.name}=${oParam.value}&`;
    });

    // Return either empty String or Params (without '&' in the end)
    sParamString = sParamString === "" ? "" : `?${sParamString.slice(0, -1)}`;
    return sParamString;
  }
}
module.exports = Downloader;
