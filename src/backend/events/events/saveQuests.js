const Quest = require("../../class/online/Quest");

const saveQuests = async function (aQuests) {
  var oQuest = new Quest();
  var bSuccess = await oQuest.save(aQuests);
  return bSuccess;
};

module.exports = saveQuests;
