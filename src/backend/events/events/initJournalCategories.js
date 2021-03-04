const JournalCategory = require("../../class/online/JournalCategory");

const initJournalCategories = async function (iJournalSection) {
  var aJournalCategories = await getJournalCategories();
  aResult =
    aJournalCategories === null
      ? null
      : formatJournalCategories(aJournalCategories, iJournalSection);
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
        isActive: false,
      });
    }
  });

  return aJournalCategoriesNew;
}

module.exports = initJournalCategories;
