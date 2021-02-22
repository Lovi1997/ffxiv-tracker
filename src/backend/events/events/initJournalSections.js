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
      isActive: true,
      Icon: 10,
    },
    {
      ID: 0,
      Name: "Hauptszenario (ARR/Heavensward/Stormblood)",
      Icon: 1,
    },
  ];

  var i = 2;
  aJournalSections.forEach((oJournalSection) => {
    oJournalSection.Icon = i > 9 ? "none" : i;
    aJournalSectionsNew.push(oJournalSection);
    i++;
  });

  return aJournalSectionsNew;
}

module.exports = initJournalSections;
