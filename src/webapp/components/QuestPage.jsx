import React, { Component } from "react";
import styles from "../css/QuestPage.module.css";
import BusyIndicator from "./BusyIndicator";
import QuestTable from "./QuestTable";
const { ipcRenderer } = window.require("electron");

class QuestPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      QuestPage: {
        loading: true,
        activeCategory: this.props.JournalCategories[0],
        Display: [],
        Quests: [],
      },
    };

    this.loadQuests(this.state.QuestPage.activeCategory.iID);
  }
  render() {
    return (
      <div>
        <div className={styles.wrapper}>
          <div
            className={styles.select}
            disabled={this.state.QuestPage.loading}
            onChange={(event) => this.onCategoryChange(event.target.value)}
            value={this.state.QuestPage.activeCategory.iID}
          >
            <select>
              {this.props.JournalCategories.map((oJournalCategory) => {
                return (
                  <option value={oJournalCategory.iID}>
                    {oJournalCategory.Name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        {this.getQuestTable()}
      </div>
    );
  }

  onCategoryChange = function (iCategoryID) {
    if (iCategoryID != this.state.QuestPage.activeCategory.iID) {
      var QuestPage = { ...this.state.QuestPage };
      QuestPage.activeCategory = this.props.JournalCategories.find(
        (oCategory) => oCategory.iID == iCategoryID
      );
      QuestPage.loading = true;
      this.setState({ QuestPage });

      this.loadQuests(QuestPage.activeCategory.iID);
    }
  };

  loadQuests = function (iJournalCategoryID) {
    ipcRenderer
      .invoke("loadQuests", iJournalCategoryID)
      .then((aResult) => this.onDataReceived(aResult, this));
  };

  getQuestTable = function () {
    if (this.state.QuestPage.loading === true) {
      return <BusyIndicator key="sea-bi" />;
    } else {
      return (
        <QuestTable
          key="qu-table"
          Quests={this.state.QuestPage.Display}
          Page={this.props.Page}
          QuestHandler={this}
        />
      );
    }
  };

  onDataReceived = function (aResult, oHandler) {
    var QuestPage = { ...oHandler.state.QuestPage };
    QuestPage.loading = false;
    QuestPage.Quests = aResult;
    QuestPage.Display = QuestPage.Quests;
    QuestPage.numberOfDone = oHandler.getNumberOfDone(QuestPage.Display);
    oHandler.setState({ QuestPage });
  };

  setDone = function (bDone, oQuest) {
    var QuestPage = { ...this.state.QuestPage };
    QuestPage.Quests[QuestPage.Quests.indexOf(oQuest)].Done = bDone;
    QuestPage.Display[QuestPage.Display.indexOf(oQuest)].Done = bDone;
    bDone === true ? ++QuestPage.iNumberOfDone : --QuestPage.iNumberOfDone;
    this.setState({ QuestPage });

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
