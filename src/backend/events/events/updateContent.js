const { Logger } = require("../../class/Util");

const updateContent = function () {
    let oLogger = new Logger();
    oLogger.log("Logger was called", 'I');
}

module.exports = updateContent;