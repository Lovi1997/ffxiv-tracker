import React, { Component } from "react";
import styles from "../css/Page.module.css";
import BusyIndicator from "./BusyIndicator";
import QuestPage from "./QuestPage";
import ErrorPage from "./ErrorPage";
import SearchPage from "./SearchPage";

const { ipcRenderer } = window.require("electron");

class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Page: {
        ready: false,
        internetConnection: null,
        state: "loading",
        JournalSection: this.props.JournalSection,
      },
    };
    this.checkConnection(this);
  }

  render() {
    return <div className={styles.page}>{this.getPage()}</div>;
  }

  getPage = function () {
    switch (this.state.Page.state) {
      case "quest":
        return <QuestPage key="pa-quest" />;
        break;
      case "search":
        return <SearchPage key="pa-search" />;
        break;
      case "error":
        return (
          <ErrorPage
            key="pa-error"
            Type={this.state.Page.internetConnection ? "Error" : "Internet"}
            checkConnection={this.checkConnection}
            Handler={this}
          />
        );
        break;
      default:
        return <BusyIndicator key="pa-bi" />;
        break;
    }
  };

  checkConnection = function (oHandler) {
    if (oHandler.state.Page.state !== "checking") {
      var Page = { ...oHandler.state.Page };
      Page.state = "checking";
      oHandler.setState({ Page });

      ipcRenderer
        .invoke("is-online")
        .then((online) => oHandler.onIsOnline(online, oHandler));
    }
  };

  onIsOnline = function (bOnline, oHandler) {
    if (bOnline === false || oHandler.state.internetConnection !== bOnline) {
      var Page = { ...oHandler.state.Page };
      Page.internetConnection = bOnline;

      if (bOnline !== true) {
        Page.ready = false;
        Page.state = "error";
      }
      oHandler.setState({ Page });

      if (bOnline === true && oHandler.state.Page.ready === false) {
        oHandler.requestData();
      }
    }
  };

  requestData = function () {
    var iJournalSectionID = this.state.Page.JournalSection.iID;
    ipcRenderer
      .invoke("init-JournalCategories", iJournalSectionID)
      .then((oResult) => this.onJournalCategoriesReceived(oResult, this));
  };

  onJournalCategoriesReceived = function (oResult, oHandler) {
    var Page = { ...oHandler.state.Page };
    if (oResult === null) {
      Page.state = "error";
    } else {
      Page.ready = true;
      Page.JournalCategories = oResult.aJournalCategories;
      if (oHandler.state.Page.JournalSection.iID === 99) {
        Page.state = "search";
      } else {
        Page.activeCategory = Page.JournalCategories[0];
        Page.state = "quest";
      }
    }
    oHandler.setState({ Page });
  };
}

export default Page;
