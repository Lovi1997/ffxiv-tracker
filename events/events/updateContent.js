//Update Asynchronous
const oContent = require('../../class/Content')
const { Logger } = require('../../class/Util');
const { updateContent } = require('../events');

// Export Event
module.exports = function (bForce) {update(bForce)};



// Update Main Function
async function update(bForce) {
  // Initialize variables
  var sMsg         = "";
  var oResponse    = {message: [], success: true};
  var oLogger      = new Logger();
  let aContentKeys = Object.keys(oContent);

  // Log Update
  oLogger.log("Checking for Update", 'I');
  oLogger.increaseDetLevel();

  // first check for update and log result
  var { bUpdateRequired, oContentUpdates } = await checkForUpdate(aContentKeys, oLogger);
  oLogger.decreaseDetLevel();

  // Update if needed
  if (bUpdateRequired === true) {
    // Perform Update
    oLogger.log("Updating Content...", 'I')
    oLogger.increaseDetLevel();
    oResponse.success = await updateContentObject(aContentKeys, oContentUpdates, oLogger);
    oLogger.decreaseDetLevel();
  } else if (bUpdateRequired === false) {
    // Log and set Response -> no update
    sMsg = "No Update required.";
    oResponse.message.push(sMsg);
    oLogger.log(sMsg, 'I');
  } else {
     // Log and set Response -> error
     sMsg = "Could not Update.";
     oResponse.message.push(sMsg);
     oLogger.log(sMsg, 'E');
  };

  // Log and set Response according if update was successful or not
  if (oResponse.success === true) {
    sMsg = "Update Successfull.";
    oResponse.message.push(sMsg);
    oLogger.log(sMsg, 'I');
  } else {
    sMsg = "Could not Update.";
    oResponse.message.push(sMsg);
    oLogger.log(sMsg, 'E');
  }

  // Send response
}


async function updateContentObject(aContentKeys, oContentUpdates, oLogger) {
  var bSuccess = true;

  // Update each Content Item
  for (var sContentKey of aContentKeys) {
    oLogger.log(`Updating Content for '${sContentKey}'.`, 'I');
    oLogger.increaseDetLevel();

    // Call Update Function
    let oContentObject = new oContent[sContentKey](oLogger);
    bSuccess = await oContentObject.update();

    oLogger.decreaseDetLevel();
  };

  // Return
  return bSuccess;
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
      bUpdateRequired = "error";
      break;
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