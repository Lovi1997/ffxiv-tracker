//Update Asynchronous
const oContent = require('../../class/Content')
const { Logger } = require('../../class/Util')

// Export Event
module.exports = function (bForce) {update(bForce)};



// Update Main Function
async function update(bForce) {
  // Initialize variables
  var oLogger = new Logger();
  let aContentKeys = Object.keys(oContent);

  // Log Update
  oLogger.log("Checking for Update", 'I');
  oLogger.increaseDetLevel();

  // first check for update and log result
  var { bUpdateRequired, oContentUpdates } = await checkForUpdate(aContentKeys, oLogger);
  oLogger.decreaseDetLevel();

  // Update if needed
  if (bUpdateRequired === true) {
    oLogger.log("Updating Content...", 'I')
    oLogger.increaseDetLevel();
    aContentKeys.forEach(function (sContentKey) {
      oLogger.log(`Updating Content for '${sContentKey}'`, 'I');
    });
  } else {
    oLogger.log("No Update required.", 'I');
  };
}

async function checkForUpdate(aContentKeys, oLogger) {
  var bUpdateRequired = false;
  var oContentUpdates = {};

  // For Each Content Object -> check if Update is required
  for (var sContentKey of aContentKeys) {
    let oContentObject = new oContent[sContentKey](oLogger);

    oContentUpdates[sContentKey] = {};

    // Receive current number of Content Items
    let iTotalLocal = await oContentObject.getTotalLocal();
    let iTotalOnline = await oContentObject.getTotalOnline();

    if (iTotalLocal === null || iTotalOnline === null) {
      // error during determination if update is required
      oLogger.log(`Could not determine if Update is required for '${sContentKey}'`, 'E');
      oContentUpdates[sContentKey].bUpdateRequired = false;
    } else if (iTotalLocal < iTotalOnline) {
      // Update is required
      oContentUpdates[sContentKey].bUpdateRequired = true;
      bUpdateRequired = true;
    } else {
      // Update is not required
      oLogger.log(`Content for '${sContentKey}' requires Update.`, 'I');
      oContentUpdates[sContentKey].bUpdateRequired = false;
    };
  };

  return { bUpdateRequired, oContentUpdates };
}