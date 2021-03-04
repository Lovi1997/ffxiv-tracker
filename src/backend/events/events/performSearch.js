const Quest = require("../../class/online/Quest");

const performSearch = async function (sSearchString) {
  var aQuests = await getQuests(sSearchString);
  aResult = aQuests === null ? null : formatQuests(aQuests);
  return aResult;
};

const getQuests = async function (sSearchString) {
  var oQuest = new Quest();
  var aQuests = await oQuest.performSearch(sSearchString);

  return aQuests;
};

const formatQuests = function (aQuests) {
  var aQuestsNew = [];

  aQuests.forEach((oQuest) => {
    aQuestsNew.push({
      iID: oQuest.ID,
      Name: oQuest.Name,
      Level: oQuest.ClassJobLevel0,
      Location: oQuest.IssuerLocation.Map.PlaceName.Name,
      JournalCategory: oQuest.JournalGenre.JournalCategory.Name,
      Done: false,
    });
  });

  return aQuestsNew;
};

module.exports = performSearch;
