import React, { Component } from "react";
import styles from "../css/SearchPage.module.css";
import BusyIndicator from "./BusyIndicator";
import QuestTable from "./QuestTable";
import Text from "../i18n/SearchPage.json";
const { ipcRenderer } = window.require("electron");

class SearchPage extends Component {
  state = {
    Search: {
      searchString: "",
      searching: false,
      Quests: [],
    },
  };
  render() {
    return (
      <div>
        <div className={styles.searchwrapper}>
          <input
            type="text"
            placeholder={Text[window.lang]["PlaceHolder"]}
            name="seachfield"
            onChange={(e) => this.handleChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                this.handleSearch();
              }
            }}
            className={styles.searchfield}
          ></input>
          <button
            className={styles.searchbutton}
            onClick={() => this.handleSearch()}
            disabled={this.state.Search.searching}
          >
            {Text[window.lang]["Search"]}
          </button>
        </div>
        {this.getQuestTable()}
      </div>
    );
  }

  handleChange = function (searchString) {
    var Search = { ...this.state.Search };
    Search.searchString = searchString;
    this.setState({ Search });
  };

  handleSearch = function () {
    if (
      this.state.Search.searching !== true &&
      this.state.Search.searchString !== ""
    ) {
      var Search = { ...this.state.Search };
      Search.searching = true;
      Search.Result = [];
      this.setState({ Search });

      this.performSearch();
    }
  };

  performSearch = function () {
    ipcRenderer
      .invoke("search", encodeURI(this.state.Search.searchString))
      .then((aResult) => this.onDataReceived(aResult, this));
  };

  getQuestTable = function () {
    if (this.state.Search.searching === true) {
      return <BusyIndicator key="sea-bi" />;
    } else {
      return (
        <div className={styles.tableWrapper}>
          <QuestTable
            key="qu-table"
            Quests={this.state.Search.Quests}
            Page={this.props.Page}
            QuestHandler={this}
          />
        </div>
      );
    }
  };

  onDataReceived = function (aResult, oHandler) {
    var Search = { ...oHandler.state.Search };
    Search.searching = false;
    Search.searchString = "";
    Search.Quests = aResult;
    oHandler.setState({ Search });
  };

  setDone = function (bDone, oQuest) {
    var Search = { ...this.state.Search };
    Search.Quests[Search.Quests.indexOf(oQuest)].Done = bDone;
    this.setState({ Search });

    this.props.App.setTotalDone(bDone);
  };
}

export default SearchPage;
