const Quest = require("../../class/local/Quest");

const saveQuests = async function (aQuests, bInclPrev) {
  var oQuest = new Quest();
  var aQuestsSave = [];
  var bReload = false;

  if (aQuests[0].Done === true && bInclPrev === true) {
    aQuestsWithPrev = [];
    oQuest.calcPrevious([aQuests[0].iID], aQuestsWithPrev);
    aQuestsWithPrev.forEach(function (oQuest) {
      aQuestsSave.push({ iID: oQuest, Done: true });
    });
    bReload = true;
  } else {
    aQuestsSave = aQuests;
  }

  var oResult = await oQuest.save(aQuestsSave);
  return {
    Success: oResult.Success,
    Reload: bReload,
    Changed: oResult.Changed,
  };
};

module.exports = saveQuests;
