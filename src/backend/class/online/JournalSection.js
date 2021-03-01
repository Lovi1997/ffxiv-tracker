const Super = require("./Super");

class JournalSection extends Super {
  constructor() {
    super();
    this._sContentName = "JournalSection";
    this._aColumns = ["ID", "Name"];
    this._sFilter = ""
  }

  async performSearch() {}
}

module.exports = JournalSection;
