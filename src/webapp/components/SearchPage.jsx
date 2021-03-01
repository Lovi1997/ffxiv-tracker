import React, { Component } from "react";
import styles from "../css/SearchPage.module.css";
import QuestTable from "./QuestTable";

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
        <QuestTable />
      </div>
    );
  }

  handleChange = function (searchString) {
    var Search = { ...this.state.Search };
    Search.searchString = searchString;
    this.setState({ Search });
  };

  handleSearch = function () {
    console.log(this.state.Search.searchString);
  };
}

export default SearchPage;
