const isDev = require("electron-is-dev");
const path = require("path");

const initJournalSections = async function () {
  // Create Result and return
  var oResult = {
    NumberDone: getNumberOfDone(),
    NumberTotal: getNumberTotal(),
    JournalSections: getJournalSections(),
  };
  await sleep();
  return oResult;
};

function getNumberOfDone() {
  // Read existing Quests
  const sPathFile = isDev
    ? "../../../../extraResources/data/quest.json"
    : `${path.join(process.env.APPDATA, "./ffxiv-tracker/quest.json")}`;
  var oExisting = require(sPathFile);

  // Count Number of Done
  var iDone = 0;
  oExisting.quests.forEach((oQuest) => {
    if (oQuest.Done === true) ++iDone;
  });
  return iDone;
}

function getNumberTotal() {
  // Read Metadata
  var oMetaData = require("../../data/metadata.json");
  return oMetaData.Total;
}

function getJournalSections() {
  // Read Journal Sections
  var aJournalSections = require("../../data/JournalSections.json");

  // Sort Journal Sections
  aJournalSections.sort((o1, o2) => {
    if (o1.ID < o2.ID) return -1;
    if (o1.ID > o2.ID) return 1;
    return 0;
  });

  // Read Config
  const sPathConfig = isDev
    ? "../../../../extraResources/config/config.json"
    : "../../../../../extraResources/config/config.json";
  const oConfig = require(sPathConfig);

  // Add Search
  var aJournalSectionsFormatted = [];
  aJournalSectionsFormatted.push({
    iID: 99,
    iActive: true,
    Icon: 10,
  });
  // Format Sections
  aJournalSections.forEach((oJournalSection) => {
    aJournalSectionsFormatted.push({
      iID: oJournalSection.ID,
      Name: oJournalSection[`Name_${oConfig.language}`],
      isActive: false,
      Icon: oJournalSection.Icon,
    });
  });

  // Return formatted JournalSectionss
  return aJournalSectionsFormatted;
}

function sleep() {
  // Wait for 0.5 seconds
  return new Promise((resolve) => setTimeout(resolve, 750));
}

module.exports = initJournalSections;
