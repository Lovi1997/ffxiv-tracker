const Super           = require('./aSuper')
const { QuestOnline } = require('../Online')
const { QuestLocal }  = require('../Local')

class Quest extends Super {
    constructor(oLogger) {
        super(oLogger)

        // Create Object online access and Local access
        this._oOnline = new QuestOnline(this._oLogger);
        this._oLocal  = new QuestLocal(this._oLogger);
    }
}
module.exports = Quest;