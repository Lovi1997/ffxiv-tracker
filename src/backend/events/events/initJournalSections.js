const JournalSection = require("../../class/online/JournalSection");
const { Downloader } = require("../../class/Util");

const initJournalSections = async function () {
  var aJournalSections = await getJournalSections();
  var { iDone, iTotal } = await getTotalDone();

  if (iDone === null || iTotal === null || aJournalSections === null) {
    oResult = null;
  } else {
    oResult = {
      Done: iDone,
      Total: iTotal,
      JournalSections: formatJournalSections(aJournalSections),
    };
  }
  return oResult;
};

async function getTotalDone() {
  var oExisting = require("../../data/quest.json");

  var iDone = 0;
  oExisting.quests.forEach((oQuest) => {
    if (oQuest.Done === true) ++iDone;
  });

  var iTotal = await getTotal();

  return { iDone, iTotal };
}

async function getTotal() {
  var oDownloader = new Downloader();
  var aParams = [
    { name: "columns", value: "ID" },
    { name: "limit", value: "1" },
    { name: "indexes", value: "quest" },
  ];

  await sleep();

  oDownloader
    .download("search", "", aParams, false)
    .then((oResult) => {
      return oResult.ResultsTotal;
    })
    .catch(() => {
      return null;
    });
}

async function getJournalSections() {
  var oJournalSection = new JournalSection();
  var aJournalSections = await oJournalSection.getAll();

  return aJournalSections;
}

function formatJournalSections(aJournalSections) {
  var aJournalSectionsNew = [
    {
      iID: 99,
      Name: "Suchen",
      isActive: true,
      Icon: 10,
    },
    {
      iID: 0,
      Name: "Hauptszenario (ARR/Heavensward/Stormblood)",
      Icon: 1,
    },
  ];

  var i = 2;
  aJournalSections.forEach((oJournalSection) => {
    if (oJournalSection.ID < 8) {
      aJournalSectionsNew.push({
        iID: oJournalSection.ID,
        Name: oJournalSection.Name,
        isActive: false,
        Icon: i,
      });
    }
    i++;
  });

  aJournalSectionsNew.push({
    iID: 98,
    Name: "Unbestimmt",
    isActive: false,
    Icon: "none",
  });

  return aJournalSectionsNew;
}

function _timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sleep() {
  await _timeout(500);
  return null;
}

module.exports = initJournalSections;
