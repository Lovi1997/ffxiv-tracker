import React, { Component } from "react";
import styles from "../css/SearchPage.module.css";
import QuestTable from "./QuestTable";

class SearchPage extends Component {
  state = {};
  render() {
    return (
      <div>
        <div className={styles.wrapper}>
          <input
            type="text"
            placeholder="Name der Quest"
            name="seachfield"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                this.handleSearch();
              }
            }}
            className={styles.searchfield}
          ></input>
          <button className={styles.searchbutton} onClick={this.handleSearch}>
            Suchen
          </button>
        </div>
        <QuestTable />
      </div>
    );
  }

  handleSearch = function () {
    console.log("pressed");
  };
}

export default SearchPage;
