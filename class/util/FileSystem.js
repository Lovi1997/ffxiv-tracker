const fs = require('file-system');
const Logger = require('./Logger');

class FileSystem {
    // Instance Data
    _oLogger = {}
    _oFS = {}

    constructor(oLogger) {
        // Create Logger if needed
        if (oLogger === undefined) {
            this._oLogger = new Logger();
        } else {
            this._oLogger = oLogger;
        };
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
            this._oLogger.log(`Read File: ${sPath}`, 'I');
        }

        var that = this;
        this._oFS.readFile(sPath, 'utf8', function (error, data) {
            that._onDataReceived(resolve, reject, error, data, bLog);
        });
    }

    _onDataReceived(resolve, reject, error, data, bLog) {
        if (error) {
            // Log StatusCode and Error
            this._oLogger.log(`ErrorCode ${error.errno}: ${error.code}`, 'E');
            this._oLogger.log(`Message: ${error.message}`, 'E');
            // Reject Promise to trigger error fallback
            reject();
        } else {
            // Log Success Message
            if (bLog === true) {
                this._oLogger.log("Message: File read successfull.", 'I');
            }
            // Resolve and return response data
            resolve(JSON.parse(data));
        };
    }
}
module.exports = FileSystem;