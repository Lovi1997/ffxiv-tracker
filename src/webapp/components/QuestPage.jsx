import React, { Component } from "react";
import styles from "../css/QuestPage.module.css";
import BusyIndicator from "./BusyIndicator";
import QuestTable from "./QuestTable";
import Text from "../i18n/QuestPage.json";
import Dropdown from "./Dropdown";
import QuestPageHelper from "./util/QuestPageHelper";
const { ipcRenderer } = window.require("electron");

class QuestPage extends Component {
  constructor(props) {
    super(props);

    var oSort =
      this.props.JournalSectionID == 0 || this.props.JournalSectionID === 1
        ? { Field: "Level", Order: "ASC" }
        : { Field: "JournalCategory", Order: "ASC" };

    this.state = {
      QPage: {
        loading: true,
        activeCategory: this.props.JournalCategories[0],
        Display: [],
        Quests: [],
        NumberOfDone: 0,
        Sort: oSort,
        Filter: { Field: "none", Value: "" },
      },
    };

    this.loadQuests(this.state.QPage.activeCategory.iID);
  }
  render() {
    return (
      <div>
        <div className={styles.questPageWrapper}>
          {this.getCategoriesUI()}
          {this.getDisplayUI()}
        </div>
        {this.getQuestTableUI()}
      </div>
    );
  }

  getCategoriesUI = function () {
    var aOptions = [];
    this.props.JournalCategories.forEach(function (oJournalCategory) {
      aOptions.push({
        Value: oJournalCategory.iID,
        Text: oJournalCategory.Name,
      });
    });
    return (
      <div className={styles.categoryWrapper}>
        <Dropdown
          disabled={this.state.QPage.loading}
          onChange={this.onCategoryChange}
          Options={aOptions}
          Handler={this}
        />
      </div>
    );
  };

  getDisplayUI = function () {
    return (
      <div>
        <div className={styles.filterWrapper}>
          <span className={styles.dropdownText}>Filter:</span>
          {this.getFilterUI()}
        </div>
        <div className={styles.sortWrapper}>
          <span className={styles.dropdownText}>
            {Text[window.lang]["Sort"]}:
          </span>
          {this.getSortUI()}
        </div>
      </div>
    );
  };

  getFilterUI = function () {
    var aOptions = QuestPageHelper.getFilterOptions(Text);
    return (
      <Dropdown
        disabled={this.state.QPage.loading}
        onChange={this.onFilterChange}
        Options={aOptions}
        Handler={this}
      />
    );
  };

  getSortUI = function () {
    var aOptions = QuestPageHelper.getSortOptions(Text);
    return (
      <Dropdown
        disabled={this.state.QPage.loading}
        onChange={this.onSortChange}
        Options={aOptions}
        Handler={this}
        Value={JSON.stringify(this.state.QPage.Sort)}
      />
    );
  };

  getQuestTableUI = function () {
    if (this.state.QPage.loading === true) {
      return <BusyIndicator key="sea-bi" />;
    } else {
      return (
        <div>
          <div className={styles.doneDisplay}>
            {Text[window.lang]["Done"]} {this.state.QPage.NumberOfDone}/
            {this.state.QPage.Quests.length}
          </div>
          <QuestTable
            key="qu-table"
            Quests={this.state.QPage.Display}
            Page={this.props.Page}
            QuestHandler={this}
          />
        </div>
      );
    }
  };

  onDisplayChange = function () {
    var QPage = { ...this.state.QPage };
    QPage.Display = QuestPageHelper.filter(QPage.Quests, QPage.Filter);
    QPage.Display = QuestPageHelper.sort(QPage.Display, QPage.Sort);
    QPage.loading = false;
    this.setState({ QPage });
  };

  onFilterChange = function (sFilter, oHandler) {
    var QPage = { ...oHandler.state.QPage };
    QPage.loading = true;
    QPage.Filter = JSON.parse(sFilter);
    oHandler.setState({ QPage });
    setTimeout(() => oHandler.onDisplayChange(), 1000);
  };

  onSortChange = function (sSort, oHandler) {
    var QPage = { ...oHandler.state.QPage };
    QPage.loading = true;
    QPage.Sort = JSON.parse(sSort);
    oHandler.setState({ QPage });
    setTimeout(() => oHandler.onDisplayChange(), 1000);
  };

  onCategoryChange = function (iCategoryID, oHandler) {
    if (iCategoryID != oHandler.state.QPage.activeCategory.iID) {
      var QPage = { ...oHandler.state.QPage };
      QPage.activeCategory = oHandler.props.JournalCategories.find(
        (oCategory) => oCategory.iID == iCategoryID
      );
      QPage.loading = true;
      QPage.NumberOfDone = 0;
      oHandler.setState({ QPage });
      oHandler.loadQuests(QPage.activeCategory.iID);
    }
  };

  loadQuests = function (iJournalCategoryID) {
    ipcRenderer
      .invoke("loadQuests", iJournalCategoryID)
      .then((aResult) => this.onDataReceived(aResult, this));
  };

  onDataReceived = function (aResult, oHandler) {
    var QPage = { ...oHandler.state.QPage };
    QPage.loading = false;
    QPage.Quests = aResult;
    QPage.NumberOfDone = oHandler.getNumberOfDone(QPage.Quests);
    QPage.Display = QuestPageHelper.filter(QPage.Quests, QPage.Filter);

    if (QPage.Sort.Field !== "Level" || QPage.Sort.Order !== "ASC") {
      QPage.Display = QuestPageHelper.sort(QPage.Display, QPage.Sort);
    }
    oHandler.setState({ QPage });
  };

  setDone = function (bDone, oQuest) {
    var QPage = { ...this.state.QPage };
    QPage.Quests[QPage.Quests.indexOf(oQuest)].Done = bDone;
    QPage.Display[QPage.Display.indexOf(oQuest)].Done = bDone;
    bDone === true ? ++QPage.NumberOfDone : --QPage.NumberOfDone;
    this.setState({ QPage });

    this.props.App.setTotalDone(bDone);
  };

  getNumberOfDone = function (aQuests) {
    var iNumberOfDone = 0;
    aQuests.forEach(function (oQuest) {
      if (oQuest.Done === true) ++iNumberOfDone;
    });
    return iNumberOfDone;
  };
}
export default QuestPage;
