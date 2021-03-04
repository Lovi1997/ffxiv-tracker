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
    var QuestPage = { ...this.state.QuestPage };
    QuestPage.activeCategory = this.props.JournalCategories.find(
      (oCategory) => oCategory.iID == iCategoryID
    );
    QuestPage.loading = true;
    this.setState({ QuestPage });

    this.loadQuests(QuestPage.activeCategory.iID);
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
          Quests={this.props.Quests}
          Page={this.props.Page}
          setDone={this.props.setDone}
        />
      );
    }
  };

  onDataReceived = function (aResult, oHandler) {
    var QuestPage = { ...oHandler.state.QuestPage };
    QuestPage.loading = false;
    oHandler.setState({ QuestPage });
    oHandler.props.setQuests(aResult, oHandler.props.Page);
  };
}

export default QuestPage;
