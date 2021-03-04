const JournalSection = require("../../class/online/JournalSection");

const initJournalSections = async function () {
  var aJournalSections = await getJournalSections();
  aResult =
    aJournalSections === null ? null : formatJournalSections(aJournalSections);
  return aResult;
};

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

  return aJournalSectionsNew;
}

module.exports = initJournalSections;
