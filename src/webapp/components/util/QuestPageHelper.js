class QuestPageHelper {
  static aFilters = [
    { Field: "none", Value: "" },
    { Field: "Done", Value: true },
    { Field: "Done", Value: false },
  ];

  static aSorts = [
    { Field: "Level", Order: "ASC" },
    { Field: "Level", Order: "DESC" },
    { Field: "Name", Order: "ASC" },
    { Field: "Name", Order: "DESC" },
    { Field: "JournalCategory", Order: "ASC" },
    { Field: "JournalCategory", Order: "DESC" },
    { Field: "Location", Order: "ASC" },
    { Field: "Location", Order: "DESC" },
  ];

  static getFilterOptions(Text) {
    var aOptions = [];
    this.aFilters.forEach(function (oFilter) {
      aOptions.push({
        Value: JSON.stringify(oFilter),
        Text: Text[window.lang][`${oFilter.Field}_${oFilter.Value}`],
      });
    });
    return aOptions;
  }

  static getSortOptions(Text) {
    var aOptions = [];
    this.aSorts.forEach(function (oSort) {
      aOptions.push({
        Value: JSON.stringify(oSort),
        Text: Text[window.lang][`${oSort.Field}_${oSort.Order}`],
      });
    });
    return aOptions;
  }

  static sort = function (aArray, oSort, sSecondary) {
    var iLower, iHigher;
    if (oSort.Order === "ASC") {
      iLower = -1;
      iHigher = 1;
    } else {
      iLower = 1;
      iHigher = -1;
    }

    var aArrayNew = [...aArray];
    var sSecondary = oSort.Field === "Level" ? "JournalCategory" : "Level";

    aArrayNew.sort(function (oObject1, oObject2) {
      if (oObject1[oSort.Field] < oObject2[oSort.Field]) {
        return iLower;
      }
      if (oObject1[oSort.Field] > oObject2[oSort.Field]) {
        return iHigher;
      }
      if (sSecondary !== oSort.Field) {
        if (oObject1[sSecondary] < oObject2[sSecondary]) {
          return -1;
        }
        if (oObject1[sSecondary] > oObject2[sSecondary]) {
          return 1;
        }
      }
      if (oObject1.iID < oObject2.iID) {
        return -1;
      }
      if (oObject1.iID > oObject2.iID) {
        return 1;
      }
      return 0;
    });
    return aArrayNew;
  };

  static filter = function (aArray, oFilter) {
    var aArrayNew = [];
    if (oFilter.Field !== "none") {
      var aArrayOld = [...aArray];
      aArrayNew = aArrayOld.filter(function (oObject) {
        return oObject[oFilter.Field] == oFilter.Value;
      });
    } else {
      aArrayNew = [...aArray];
    }
    return aArrayNew;
  };
}

export default QuestPageHelper;
