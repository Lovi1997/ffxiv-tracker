const Quest = require("../../class/online/Quest");

const performSearch = async function (sSearchString) {
  var aResult = await getQuests(sSearchString);
  return aResult;
};

const getQuests = async function (sSearchString) {
  var oQuest = new Quest();
  var aQuests = await oQuest.performSearch(sSearchString);
  return oQuest.format(aQuests, true);
};

module.exports = performSearch;
