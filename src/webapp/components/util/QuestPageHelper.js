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

    aArrayNew.sort(function (oObject1, oObject2) {
      var sValue1 = "";
      var sValue2 = "";

      if (oSort.Field === "Level") {
        sValue1 = parseInt(oObject1[oSort.Field].toString().toUpperCase());
        sValue2 = parseInt(oObject2[oSort.Field].toString().toUpperCase());
      } else {
        sValue1 = oObject1[oSort.Field].toString().toUpperCase();
        sValue2 = oObject2[oSort.Field].toString().toUpperCase();
      }

      if (sValue1 < sValue2) {
        return iLower;
      }
      if (sValue1 > sValue2) {
        return iHigher;
      }

      if (sSecondary !== undefined && sSecondary !== oSort.Field) {
        var sValue3 = "";
        var sValue4 = "";
        if (sSecondary === "Level") {
          sValue3 = parseInt(oObject1[sSecondary].toString().toUpperCase());
          sValue4 = parseInt(oObject2[sSecondary].toString().toUpperCase());
        } else {
          sValue3 = oObject1[sSecondary].toString().toUpperCase();
          sValue4 = oObject2[sSecondary].toString().toUpperCase();
        }

        if (sValue3 < sValue4) {
          return -1;
        }
        if (sValue3 > sValue4) {
          return 1;
        }
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
