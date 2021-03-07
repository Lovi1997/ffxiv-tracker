const JournalCategory = require("../../class/online/JournalCategory");

const initJournalCategories = async function (iJournalSection) {
  var aResult = [];
  if (iJournalSection != 98) {
    var aJournalCategories = await getJournalCategories();
    aResult =
      aJournalCategories === null
        ? null
        : formatJournalCategories(aJournalCategories, iJournalSection);
  } else {
    aResult = [
      {
        iID: 0,
        Name: "Unbestimmt",
      },
    ];
  }
  return aResult;
};

async function getJournalCategories() {
  var oJournalCategory = new JournalCategory();
  var aJournalCategories = await oJournalCategory.getAll();

  return aJournalCategories;
}

function formatJournalCategories(aJournalCategories, iJournalSection) {
  var aJournalCategoriesNew = [];

  aJournalCategories.forEach((oJournalCategory) => {
    if (oJournalCategory.JournalSectionTargetID == iJournalSection) {
      aJournalCategoriesNew.push({
        iID: oJournalCategory.ID,
        Name: oJournalCategory.Name,
      });
    }
  });

  return aJournalCategoriesNew;
}

module.exports = initJournalCategories;
