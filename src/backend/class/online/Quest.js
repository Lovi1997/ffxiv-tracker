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
      "JournalGenre.Name",
      "IssuerLocation.Map.PlaceName.Name",
    ];
    this._sSortField = "ClassJobLevel0";
    this._sFilter = "JournalGenre.JournalCategoryTargetID";
  }

  getAll() {}

  format(aQuests) {
    if (aQuests === null) {
      return null;
    }

    var aQuestsNew = [];

    aQuests.forEach((oQuest) => {
      aQuestsNew.push({
        iID: oQuest.ID,
        Name: oQuest.Name,
        Level: oQuest.ClassJobLevel0,
        Location: oQuest.IssuerLocation.Map.PlaceName.Name,
        JournalCategory: oQuest.JournalGenre.Name,
        Done: false,
      });
    });

    return aQuestsNew;
  }
}

module.exports = Quest;
