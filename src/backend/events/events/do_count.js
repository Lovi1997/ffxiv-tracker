const { Downloader, FileSystem } = require("../../class/Util");

const do_count = async function () {
  var aParams = [
    {
      name: "columns",
      value:
        "ID,Name,JournalGenre.Name,JournalGenre.JournalCategory.Name,JournalGenre.JournalCategory.JournalSection.Name",
    },
    { name: "language", value: "de" },
    { name: "limit", value: "850" },
    { name: "sort_field", value: "ID" },
  ];

  var oEverything = await getEverything(aParams);
  if (oEverything === null) return;
  var oIndexes = await getIndexes(aParams);
  if (oIndexes === null) return;
  var oFiltered = await getFiltered(aParams);
  if (oFiltered === null) return;

  console.log("Check: ALL not in Indexes");
  var bSuccess = await checkIsIn(
    oEverything.Data,
    oIndexes.Data,
    "all_not_in_indexes",
    oEverything.Total
  );
  console.log("");
  console.log("");
  if (bSuccess === false) return;

  console.log("Check: ALL not in Filtered");
  bSuccess = await checkIsIn(
    oEverything.Data,
    oFiltered.Data,
    "all_not_in_filtered",
    oEverything.Total
  );
  console.log("");
  console.log("");
  if (bSuccess === false) return;

  console.log("Check: Indexes not in Filtered");
  bSuccess = await checkIsIn(
    oIndexes.Data,
    oFiltered.Data,
    "indexes_not_in_filtered",
    oIndexes.Total
  );
  console.log("");
  console.log("");
  if (bSuccess === false) return;

  console.log("Check: Indexes not in All");
  bSuccess = await checkIsIn(
    oIndexes.Data,
    oEverything.Data,
    "indexes_not_in_all",
    oIndexes.Total
  );
  console.log("");
  console.log("");
  if (bSuccess === false) return;

  console.log("Check: Filtered not in All");
  bSuccess = await checkIsIn(
    oFiltered.Data,
    oEverything.Data,
    "filtered_not_in_all",
    oFiltered.Total
  );
  console.log("");
  console.log("");
  if (bSuccess === false) return;

  console.log("Check: Filtered not in Indexes");
  bSuccess = await checkIsIn(
    oFiltered.Data,
    oIndexes.Data,
    "filtered_not_in_indexes",
    oFiltered.Total
  );
  console.log("");
  console.log("");
  if (bSuccess === false) return;
};

const checkIsIn = async function (aMore, aLess, sFile, iTotal) {
  var aMissing = [];

  aMore.forEach((oCheck, iCurrent) => {
    if (iCurrent % 500 === 0) {
      console.log(`Checking: ${iCurrent + 1} of ${iTotal}`);
      sleep();
    } else if (iCurrent + 1 === iTotal) {
      console.log(`Checking: ${iCurrent + 1} of ${iTotal}`);
      sleep();
    }
    var iIndex = aLess.findIndex((oExisting) => {
      return oExisting.ID == oCheck.ID;
    });

    if (iIndex === -1) {
      aMissing.push(oCheck);
    }
  });
  var bSuccess = await save(sFile, aMissing);
  return bSuccess;
};

const getEverything = async function (aParams) {
  console.log("Download Everything");
  var oQuests = await download("Quest", aParams);
  if (oQuests === null) return null;

  console.log("Saving Everthing");
  var bSuccess = await save("all", oQuests);
  if (bSuccess !== false) {
    console.log("Save Finished");
    console.log("");
    console.log("");
    return oQuests;
  } else {
    console.log("Error while saving.");
    return null;
  }
};

const getIndexes = async function (aParams) {
  console.log("Download with Indexes Quest");
  aParams.push({ name: "indexes", value: "Quest" });
  var oQuests = await download("search", aParams);

  console.log("Saving with Indexes Quest");
  var bSuccess = await save("indexes", oQuests);
  if (bSuccess !== false) {
    console.log("Save Finished");
    console.log("");
    console.log("");
    return oQuests;
  } else {
    console.log("Error while saving.");
    return null;
  }
};

const getFiltered = async function (aParams) {
  console.log("Download with Filter");
  var aJournalCategories = await getJournalCategories();
  console.log("");

  aParameters = [];
  var oQuests = { Total: 0, Data: [] };

  for (var i = 0; i < aJournalCategories.length; i++) {
    var oCategory = aJournalCategories[i];
    console.log(`Downloading Quests of Category: ${oCategory.Name}`);
    aParameters = [];
    aParams.forEach((oParam) => aParameters.push(oParam));

    aParameters.push({
      name: "filters",
      value: `JournalGenre.JournalCategoryTargetID=${oCategory.ID}`,
    });

    var oResult = await download("search", aParameters);

    oQuests.Total = oQuests.Total + oResult.Total;
    oResult.Data.forEach((oData) => oQuests.Data.push(oData));
  }

  console.log(`Downloading Quests of Category: Unbestimmt`);
  aParameters = [];
  aParams.forEach((oParam) => aParameters.push(oParam));

  aParameters.push({
    name: "filters",
    value: `JournalGenreTargetID=0`,
  });

  oResult = await download("search", aParameters);

  oQuests.Total = oQuests.Total + oResult.Total;
  oResult.Data.forEach((oData) => oQuests.Data.push(oData));

  console.log("");

  console.log("Saving with Filter");
  var bSuccess = await save("filtered", oQuests);
  if (bSuccess !== false) {
    console.log("Save Finished");
    console.log("");
    console.log("");
    return oQuests;
  } else {
    console.log("Error while saving.");
    return null;
  }
};

const getJournalCategories = async function () {
  aParams = [
    {
      name: "columns",
      value:
        "ID,Name,JournalSection.ID,JournalSection.Name,JournalSectionTargetID",
    },
    { name: "language", value: "de" },
    { name: "limit", value: "850" },
    { name: "sort_field", value: "ID" },
  ];

  console.log("Downloading JournalCategories");
  var oJournalCategories = await download("JournalCategory", aParams);
  if (oJournalCategories === null) return null;

  console.log("Filtering JournalCategories");
  var aJournalCategoriesNew = [];
  oJournalCategories.Data.forEach((oCategory) => {
    switch (oCategory.JournalSectionTargetID) {
      case 0:
        oCategory.JournalSection = { ID: 0, Name: "Hauptszenario" };
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        aJournalCategoriesNew.push(oCategory);
        break;
      default:
        break;
    }
  });
  console.log(aJournalCategoriesNew);
  return aJournalCategoriesNew;
};

const save = async function (sFile, oData) {
  var oFileSystem = new FileSystem();
  var bResult = await oFileSystem
    .write(`./data/${sFile}.json`, oData, false)
    .then((result) => {
      return result;
    });
  return bResult;
};

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function sleep() {
  await timeout(1000);
  return "waited";
}

const download = async function (sPath, aParams) {
  var oDownloader = new Downloader();

  var bComplete = false;
  var bError = false;
  var oQuests = { Total: 0, PageTotal: 0, Data: [] };
  var iPage = 1;
  var aParameters = [];
  await sleep();
  while (bComplete === false) {
    await sleep();
    console.log(`Downloading Page ${iPage}/${oQuests.PageTotal}`);

    aParameters = [];
    aParams.forEach((oParam) => aParameters.push(oParam));
    aParameters.push({ name: "page", value: iPage });

    await oDownloader
      .download(sPath, "", aParameters, false)
      .then((oResult) => {
        oQuests.Total = oResult.Pagination.ResultsTotal;
        oQuests.PageTotal = oResult.Pagination.PageTotal;
        oResult.Results.forEach(function (oQuest) {
          oQuests.Data.push(oQuest);
        });
        if (iPage == oQuests.PageTotal || oQuests.PageTotal == 0) {
          bComplete = true;
        } else {
          ++iPage;
        }
      })
      .catch(() => {
        console.log("Error during Download");
        bError = true;
        bComplete = true;
      });

    await sleep();
  }
  await sleep();
  await sleep();

  return bError === true ? null : oQuests;
};

module.exports = do_count;
