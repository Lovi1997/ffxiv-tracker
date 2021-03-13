const { FileSystem } = require("../Util");
const Super = require("./Super");
const isDev = require("electron-is-dev");

class Quest extends Super {
  static _saving = false;

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
      "Icon",
      "IconID",
    ];
    this._sSortField = "ClassJobLevel0";
    this._sFilter = "JournalGenre.JournalCategoryTargetID";

    this._FileSystem = new FileSystem();
  }

  getAll() {}

  async getWithFilter(sFilterValue) {
    this._sFilter =
      sFilterValue == 0
        ? "JournalGenreTargetID"
        : "JournalGenre.JournalCategoryTargetID";
    var aResult = await super.getWithFilter(sFilterValue);
    return aResult;
  }

  format(aQuests, bSearch) {
    if (aQuests === null) {
      return null;
    }

    const sPathRead = isDev
      ? "../../../../extraResources/data/quest.json"
      : "../../../../../extraResources/data/quest.json";

    while (Quest._saving === true) {}
    var aQuestsNew = [];
    var oExisting = require(sPathRead);

    aQuests.forEach((oQuest) => {
      var sJournalCategory = "";
      if (bSearch === true) {
        sJournalCategory = oQuest.JournalGenre.JournalCategory.Name;
      } else {
        sJournalCategory = oQuest.JournalGenre.Name;
      }
      var iExisting = oExisting.quests.findIndex(function (oElement) {
        return oElement.iID === oQuest.ID;
      });

      var bDone = false;
      if (iExisting === -1) {
        bDone = false;
      } else {
        bDone = oExisting.quests[iExisting].Done;
      }

      aQuestsNew.push({
        iID: oQuest.ID,
        IconID: oQuest.IconID,
        Icon: oQuest.Icon,
        Name: oQuest.Name,
        Level: oQuest.ClassJobLevel0,
        Location: oQuest.IssuerLocation.Map.PlaceName.Name,
        JournalCategory: sJournalCategory,
        Done: bDone,
      });
    });

    oExisting = null;
    return aQuestsNew;
  }

  async save(aQuestsNew) {
    const sPathFile = isDev
      ? "../../../../extraResources/data/quest.json"
      : "../../../../../extraResources/data/quest.json";

    var oQuests = require(sPathFile);
    aQuestsNew.forEach(function (oQuestNew) {
      var iExisting = oQuests.quests.findIndex(function (oElement) {
        return oElement.iID === oQuestNew.iID;
      });

      if (iExisting === -1) {
        oQuests.quests.push({
          iID: oQuestNew.iID,
          Done: oQuestNew.Done,
        });
      } else {
        oQuests.quests[iExisting].Done = oQuestNew.Done;
      }
    });

    // Call FileSystem
    while (Quest._saving === true) {}
    Quest._saving = true;
    var bResult = await this._FileSystem
      .write(sPathFile, oQuests, false)
      .then((result) => {
        Quest._saving = false;
        return result;
      });
    oQuests = null;
    return bResult;
  }
}

module.exports = Quest;
