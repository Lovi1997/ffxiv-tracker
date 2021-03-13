const { createLogger, format, transports } = require("winston");
const isDev = require("electron-is-dev");
const sPathConfig = isDev
  ? "../../../../extraResources/config/config.json"
  : "../../../../../config/config.json";
const config = require(sPathConfig);
const path = require("path");

class Logger {
  // Class Data
  static sLevelOffset = "          ";

  // Instance Data
  _iLevel = 0;
  _sSpan = "";
  _oWinston = {};

  constructor() {
    const sPathLog = isDev
      ? "../../../../extraResources/log/log.log"
      : "../../../../../log/log.log";

    this._iLevel = 0;
    this._sSpan = "";
    this._oWinston = createLogger({
      transports: new transports.File({
        filename: `${path.join(__dirname, sPathLog)}`,
        format: format.combine(
          format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
          format.align(),
          format.printf(
            (info) => `${info.level}: ${[info.timestamp]}: ${info.message}`
          )
        ),
      }),
    });
  }

  increaseDetLevel() {
    this._iLevel = this._iLevel + 1;
    this._sSpan = this._sSpan + Logger.sLevelOffset;
  }

  decreaseDetLevel() {
    if (this._iLevel > 0) {
      this._iLevel = this._iLevel - 1;
      this._sSpan = this._sSpan.slice(0, -10);
    }
  }

  finish() {
    this._iLevel = 0;
    this._sSpan = "";
    this._oWinston.info("");
    this._oWinston.info("");
  }

  log(sText, cType, bConsole) {
    // Add span according to detlevel
    sText = cType === "E" ? `"${sText}"` : sText;
    var sMsg = `${this._sSpan}${sText}`;

    // Log according to Message Type
    switch (cType) {
      case "I":
        this._oWinston.log("info", sMsg);
        break;
      case "W":
        this._oWinston.log("warn", sMsg);
        break;
      case "E":
        this._oWinston.log("error", sMsg);
        break;
      default:
        this._oWinston.log("silly", sMsg);
        break;
    }

    // Log in console if requested
    if (bConsole === true || config.console_log === true) {
      console.log(sMsg);
    }
  }
}
module.exports = Logger;
