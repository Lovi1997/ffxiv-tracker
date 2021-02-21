const { Logger } = require("../../class/Util");
const JournalSection = require("../../class/online/JournalSection");

const initJournalSections = async function (oSender) {
  var aJournalSections = await getJournalSections();
  oResult =
    aJournalSections === null
      ? null
      : { aJournalSections: formatJournalSections(aJournalSections) };
  return oResult;
};

async function getJournalSections() {
  var oJournalSection = new JournalSection();
  var aJournalSections = await oJournalSection.getAll();

  return aJournalSections;
}

function formatJournalSections(aJournalSections) {
  var aJournalSectionsNew = [
    {
      ID: 99,
      Name: "Suchen",
    },
    {
      ID: 0,
      Name: "Hauptszenario (ARR/Heavensward/Stormblood)",
    },
  ];
  aJournalSections.forEach((oJournalSection) =>
    aJournalSectionsNew.push(oJournalSection)
  );
  return aJournalSectionsNew;
}

module.exports = initJournalSections;
