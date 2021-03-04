const Super = require("./Super");

class JournalSection extends Super {
  constructor() {
    super();
    this._sContentName = "JournalSection";
    this._aColumns = ["ID", "Name"];
    this._sSortField = "ID";
    this._sFilter = "";
  }

  async performSearch() {}

  async getWithFilter() {}
}

module.exports = JournalSection;
