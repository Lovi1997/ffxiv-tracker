const isDev = require("electron-is-dev");
const path = require("path");

const initJournalCategories = async function (iJournalSection) {
  var aResult = getJournalCategories(iJournalSection);
  await sleep();
  return aResult;
};

function getJournalCategories(iJournalSection) {
  // Get Config
  const sPathConfig = isDev
    ? "../../../../extraResources/config/config.json"
    : "../../../../../extraResources/config/config.json";
  const oConfig = require(sPathConfig);

  // Read Journal Categories
  var aJournalCategoriesFormatted = [];
  var aJournalCategories = require(`../../data/JournalCategories/js${iJournalSection}.json`);

  // Format Journal Categories
  aJournalCategories.forEach((oJournalCategory) => {
    aJournalCategoriesFormatted.push({
      iID: oJournalCategory.ID,
      Name: oJournalCategory[`Name_${oConfig.language}`],
    });
  });
  return aJournalCategoriesFormatted;
}

function sleep() {
  // Wait for 0.5 seconds
  return new Promise((resolve) => setTimeout(resolve, 750));
}

module.exports = initJournalCategories;
