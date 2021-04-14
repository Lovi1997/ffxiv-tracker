const Quest = require("../../class/local/Quest");

const performSearch = async function (sSearchString) {
  var aResult = await getQuests(sSearchString);
  return aResult;
};

const getQuests = async function (sSearchString) {
  var oQuest = new Quest();
  var aQuests = await oQuest.performSearch(sSearchString);
  return aQuests;
};

module.exports = performSearch;
