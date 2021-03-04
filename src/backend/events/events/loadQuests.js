const Quest = require("../../class/online/Quest");

const loadQuests = async function (iJournalCategory) {
  var aResult = null;
  aResult = await getQuests(iJournalCategory);
  return aResult;
};

async function getQuests(iJournalCategory) {
  var oQuest = new Quest();
  var aQuests = await oQuest.getWithFilter(iJournalCategory);
  return oQuest.format(aQuests);
}

module.exports = loadQuests;
