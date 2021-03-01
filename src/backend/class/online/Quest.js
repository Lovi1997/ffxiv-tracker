const Super = require("./Super");

class Quest extends Super {
  constructor() {
    super();
    this._sContentName = "Quest";
    this._aColumns = [
      "ID",
      "Name",
      "ClassJobLevel0",
      "JournalGenre.JournalCategory.Name",
      "IssuerLocation.Map.PlaceName.Name",
    ];
    this._sSortField = "ClassJobLevel0";
    this._sFilter = "";
  }
}

module.exports = Quest;
