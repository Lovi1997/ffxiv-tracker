const fs = require("file-system");
const Logger = require("./Logger");
const path = require("path");

class FileSystem {
  // Instance Data
  _oLogger = {};
  _oFS = {};

  constructor(oLogger) {
    // Create Logger if needed
    if (oLogger === undefined) {
      this._oLogger = new Logger();
    } else {
      this._oLogger = oLogger;
    }
    this._oFS = fs;
  }

  read(sPath, bLog) {
    // return Promise for async Read
    var that = this;
    return new Promise(function (resolve, reject) {
      that._onRead(resolve, reject, sPath, bLog);
    });
  }

  _onRead(resolve, reject, sPath, bLog) {
    // Log Info
    if (bLog === true) {
      this._oLogger.log(`Read File: ${sPath}`, "I");
    }

    var that = this;
    this._oFS.readFile(sPath, "utf8", function (error, data) {
      that._onDataReceived(resolve, reject, error, data, bLog);
    });
  }

  _onDataReceived(resolve, reject, error, data, bLog) {
    if (error) {
      // Log StatusCode and Error
      this._oLogger.log(`ErrorCode ${error.errno}: ${error.code}`, "E");
      this._oLogger.log(`Message: ${error.message}`, "E");
      this._oLogger.log(`Could not read File '${error.path}'.`, "E");
      // Reject Promise to trigger error fallback
      reject();
    } else {
      // Log Success Message
      if (bLog === true) {
        this._oLogger.log("Message: File read successfull.", "I");
      }
      // Resolve and return response data
      resolve(JSON.parse(data));
    }
  }

  write(sPath, oData, bLog) {
    // return Promise for async Read
    var that = this;
    return new Promise(function (resolve, reject) {
      that._onWrite(resolve, reject, sPath, oData, bLog);
    });
  }

  _onWrite(resolve, reject, sPath, oData, bLog) {
    // Log Info
    if (bLog === true) {
      this._oLogger.log(`Write File: ${sPath}`, "I");
    }

    var that = this;
    var sData = JSON.stringify(oData, null, 4);
    this._oFS.writeFile(
      `${path.join(__dirname, sPath)}`,
      sData,
      function (error) {
        that._onWriteFinished(resolve, reject, error, bLog);
      }
    );
  }

  _onWriteFinished(resolve, reject, error, bLog) {
    if (error) {
      // Log StatusCode and Error
      this._oLogger.log(`ErrorCode ${error.errno}: ${error.code}`, "E");
      this._oLogger.log(`Message: ${error.message}`, "E");
      this._oLogger.log(`Could not write File '${error.path}'.`, "E");
      // Reject Promise to trigger error fallback
      resolve(false);
    } else {
      // Log Success Message
      if (bLog === true) {
        this._oLogger.log("Message: File write successfull.", "I");
      }
      // Resolve and return response data
      resolve(true);
    }
  }
}
module.exports = FileSystem;
