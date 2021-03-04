const Super = require("./Super");

class JournalCategory extends Super {
  constructor() {
    super();
    this._sContentName = "JournalCategory";
    this._aColumns = ["ID", "Name", "JournalSectionTargetID"];
    this._sSortField = "ID";
    this._sFilter = "";
  }

  async performSearch() {}

  async getWithFilter() {}
}

module.exports = JournalCategory;