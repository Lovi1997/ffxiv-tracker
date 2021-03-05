import React, { Component } from "react";
import styles from "../css/Page.module.css";
import BusyIndicator from "./BusyIndicator";
import QuestPage from "./QuestPage";
import ErrorPage from "./ErrorPage";
import SearchPage from "./SearchPage";
import MessageToastContainer from "./MessageToastContainer";

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
        JournalCategories: [],
        Quests: [],
        Messages: [],
      },
    };
    this.checkConnection(this);
  }

  render() {
    return (
      <div className={styles.page}>
        {this.getPage()}
        <MessageToastContainer
          Messages={this.state.Page.Messages}
          Page={this}
        />
      </div>
    );
  }

  getPage = function () {
    switch (this.state.Page.state) {
      case "quest":
        return (
          <QuestPage
            setQuests={this.setQuests}
            setDone={this.setDone}
            Quests={this.state.Page.Quests}
            Page={this}
            JournalCategories={this.state.Page.JournalCategories}
            key="pa-quest"
          />
        );
        break;
      case "search":
        return (
          <SearchPage
            setQuests={this.setQuests}
            setDone={this.setDone}
            Quests={this.state.Page.Quests}
            Page={this}
            key="pa-search"
          />
        );
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
    if (this.state.Page.JournalSection.iID === 99) {
      var Page = { ...this.state.Page };
      Page.state = "search";
      this.setState({ Page });
    } else {
      var iJournalSectionID = this.state.Page.JournalSection.iID;
      ipcRenderer
        .invoke("init-JournalCategories", iJournalSectionID)
        .then((aResult) => this.onDataReceived(aResult, this));
    }
  };

  onDataReceived = function (aResult, oHandler) {
    var Page = { ...oHandler.state.Page };
    if (aResult === null) {
      Page.state = "error";
    } else {
      Page.ready = true;
      Page.JournalCategories = aResult;
      Page.state = "quest";
    }
    oHandler.setState({ Page });
  };

  setQuests = function (aQuests, oHandler) {
    var Page = { ...oHandler.state.Page };
    Page.Quests = aQuests;
    oHandler.setState({ Page });
  };

  setDone = function (bDone, oQuest, oHandler) {
    var Page = { ...oHandler.state.Page };
    Page.Quests[Page.Quests.indexOf(oQuest)].Done = bDone;
    oHandler.setState({ Page });
  };

  delMessages = function (oMessage) {
    var Page = { ...this.state.Page };
    var iIndex = Page.Messages.indexOf(oMessage);
    if (iIndex > -1) {
      Page.Messages.splice(iIndex, 1);
    }
    Page.refresh = Math.floor(Math.random() * 101 + 1);
    this.setState({ Page });
  };

  addMSG = function (sText, cType) {
    var Page = { ...this.state.Page };
    Page.Messages.push({
      iID: Math.floor(Math.random() * 101 + 1),
      Type: cType,
      Text: sText,
    });
    this.setState({ Page });
  };
}

export default Page;
