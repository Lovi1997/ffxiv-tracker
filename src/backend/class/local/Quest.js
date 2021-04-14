const { FileSystem } = require("../Util");
const isDev = require("electron-is-dev");
const path = require("path");

class Quest {
  static _saving = false;

  constructor() {
    this._FileSystem = new FileSystem();

    // Get Config
    const sPathConfig = isDev
      ? "../../../../extraResources/config/config.json"
      : "../../../../../extraResources/config/config.json";
    this.Config = require(sPathConfig);
  }

  async performSearch(sString) {
    // Search in each Section and Category, but first get the regex
    // -> any Character multiple times, then our String, then any Character multiple times
    var sRegEx = `.*${sString}.*`;
    var oRegex = new RegExp(sRegEx, "i");

    var aQuestsFound = [];

    // Get Journal Sections
    var aJournalSections = require("../../data/JournalSections.json");

    // For Each JournalSection, search through Categories
    aJournalSections.forEach((oSection) => {
      // Get Categories
      var aCategories = require(`../../data/JournalCategories/js${oSection.ID}.json`);

      // For Each Category, search through Quests
      aCategories.forEach((oCategory) => {
        // Get Quests
        var aQuests = require(`../../data/Quests/${this.Config.language}/S${oSection.ID}C${oCategory.ID}.json`);

        // For Each Quest, check if Name matches Search
        aQuests.forEach((oQuest) => {
          var bMatch = oRegex.test(oQuest.Name);
          if (bMatch === true) {
            aQuestsFound.push(oQuest);
          }
        });
      });
    });

    // Format
    var aQuestsFormatted = await this.formatGeneral(aQuestsFound);
    await this.sleep();
    return aQuestsFormatted;
  }

  async getForSectionAndCategory(iSection, iCategory) {
    // Get Quests
    var aQuests = require(`../../data/Quests/${this.Config.language}/S${iSection}C${iCategory}.json`);
    var aQuestsFormatted = await this.formatGeneral(aQuests);

    // Return formatted Quests
    await this.sleep();
    return aQuestsFormatted;
  }

  async formatGeneral(aQuests) {
    // Get Path for done Quests
    const sPathRead = isDev
      ? "../../../../extraResources/data/quest.json"
      : `${path.join(process.env.APPDATA, "./ffxiv-tracker/quest.json")}`;

    // Read Quests if not currently saving
    while (Quest._saving === true) {
      await this.sleep();
    }
    var aQuestsNew = [];
    var oExisting = require(sPathRead);

    // Sort Quests by Sequence
    aQuests.sort((o1, o2) => {
      if (o1.Seq < o2.Seq) return -1;
      if (o1.Seq > o2.Seq) return 1;
      return 0;
    });

    // Format Each Quest
    aQuests.forEach((oQuest) => {
      // Find in done Quests
      var iExisting = oExisting.quests.findIndex(function (oElement) {
        return oElement.iID === oQuest.ID;
      });

      // Get Done flag (either from existing, or it is false)
      var bDone = false;
      if (iExisting !== -1) {
        bDone = oExisting.quests[iExisting].Done;
      }

      // Get Starting Job
      var sJob = oQuest.StartClass === null ? oQuest.Job : oQuest.StartClass;

      // Get Start Location
      try {
        var sLocation =
          oQuest.StartLocation === ""
            ? oQuest.Location
            : `${oQuest.Location} (X:${oQuest.StartLocation.X} Y:${oQuest.StartLocation.Y})`;
      } catch (e) {
        console.log(oQuest);
      }
      // Format and add to new Array
      aQuestsNew.push({
        iID: oQuest.ID,
        Icon: oQuest.Icon,
        Jobs: sJob,
        Name: oQuest.Name,
        Level: oQuest.Level,
        Location: sLocation,
        JournalCategory: oQuest.JournalGenre,
        Done: bDone,
        Seq: oQuest.Seq,
      });
    });

    // Formatting finished
    return aQuestsNew;
  }

  formatDetail(oQuest) {}

  async save(aQuestsNew) {
    var sPathFile = "";
    var bFullPath = true;

    // Get Path of done Quests
    if (isDev) {
      sPathFile = "../../../../extraResources/data/quest.json";
      bFullPath = false;
    } else {
      bFullPath = true;
      sPathFile = `${path.join(process.env.APPDATA, "./ffxiv-tracker/quest.json")}`;
    }

    // Read Quests and Update "Done" Flag for each as needed
    var oQuests = require(sPathFile);
    aQuestsNew.forEach(function (oQuestNew) {
      // Search for Quest
      var iExisting = oQuests.quests.findIndex(function (oElement) {
        return oElement.iID === oQuestNew.iID;
      });

      // Check for Quest already existing
      if (iExisting === -1) {
        // If no, add Quest
        oQuests.quests.push({
          iID: oQuestNew.iID,
          Done: oQuestNew.Done,
        });
      } else {
        // If yes, update "Done" Flag
        oQuests.quests[iExisting].Done = oQuestNew.Done;
      }
    });

    // Wait for running Save to be finished
    while (Quest._saving === true) {
      await this.sleep();
    }

    // Call File System and write Quests
    Quest._saving = true;
    var bResult = await this._FileSystem.write(sPathFile, oQuests, false, bFullPath).then((result) => {
      Quest._saving = false;
      return result;
    });

    // Free memory and return
    oQuests = null;
    return bResult;
  }

  sleep() {
    // Wait for 0.5 seconds
    return new Promise((resolve) => setTimeout(resolve, 500));
  }
}

module.exports = Quest;
