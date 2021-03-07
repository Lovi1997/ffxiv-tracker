const Super = require("./Super");

class JournalCategory extends Super {
  static _JournalCategories = [];

  constructor() {
    super();
    this._sContentName = "JournalCategory";
    this._aColumns = ["ID", "Name", "JournalSectionTargetID"];
    this._sSortField = "ID";
    this._sFilter = "";
  }

  async getAll() {
    var aResult = [];
    if (JournalCategory._JournalCategories.length === 0) {
      aResult = await super.getAll();
    } else {
      aResult = JournalCategory._JournalCategories;
    }
    return aResult;
  }

  async performSearch() {}

  async getWithFilter() {}
}

module.exports = JournalCategory;
