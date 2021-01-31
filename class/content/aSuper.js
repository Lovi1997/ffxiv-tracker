const { Logger } = require('../Util')

class Super {
        // Instance Data
        _oOnline = {}
        _oLocal  = {}
        _oLogger = {}

    constructor(oLogger) {
        // Create Logger if needed
        if (oLogger === undefined) {
            this._oLogger = new Logger();
        } else {
            this._oLogger = oLogger;
        };
    }

     // Read number of Quests saved on local PC
     async getTotalLocal() {
        let iNumber = await this._oLocal.getTotal();
        return iNumber
    }

    // get number of Quests currently on XIVAPI
    async getTotalOnline() {
        let iNumber = await this._oOnline.getTotal()
        return iNumber;
    }

    async update() {

        
        return true;
    }
}
module.exports = Super;