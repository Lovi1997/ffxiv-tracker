const Quest = require("../../class/local/Quest");

const loadQuests = async function (iJournalSection, iJournalCategory) {
  var oQuest = new Quest();
  var aResult = await oQuest.getForSectionAndCategory(iJournalSection, iJournalCategory);
  return aResult;
};

module.exports = loadQuests;
