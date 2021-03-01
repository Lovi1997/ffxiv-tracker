import React, { Component } from "react";
import styles from "../css/SearchPage.module.css";
import BusyIndicator from "./BusyIndicator";
import QuestTable from "./QuestTable";
const { ipcRenderer } = window.require("electron");

class SearchPage extends Component {
  state = {
    Search: {
      searchString: "",
      searching: false,
    },
  };
  render() {
    return (
      <div>
        <div className={styles.wrapper}>
          <input
            type="text"
            placeholder="Name der Quest"
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
            Suchen
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
      .invoke("search", this.state.Search.searchString)
      .then((aResult) => this.onDataReceived(aResult, this));
  };

  getQuestTable = function () {
    if (this.state.Search.searching === true) {
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
    var Search = { ...oHandler.state.Search };
    Search.searching = false;
    Search.searchString = "";
    oHandler.setState({ Search });
    oHandler.props.setQuests(aResult, oHandler.props.Page);
  };
}

export default SearchPage;
