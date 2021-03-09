import React, { Component } from "react";
import Navbar from "./Navbar";
import BusyIndicator from "./BusyIndicator";
import Header from "./Header";
import ErrorPage from "./ErrorPage";
import Page from "./Page";
import styles from "../css/App.module.css";
import Text from "../i18n/App.json";

const { ipcRenderer } = window.require("electron");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      App: {
        state: "loading",
        ready: false,
        JournalSections: [],
        internetConnection: null,
        activeSection: null,
        navigating: false,
        NumberDone: 0,
        NumberTotal: 0,
      },
    };
    this.checkConnection(this);

    window.lang = ipcRenderer.sendSync("get_lang");
    console.log("Window created");
  }

  changeLangu = function (sLangu) {
    var that = this;
    ipcRenderer.invoke("changeLangu", sLangu).then((bResult) => {
      if (bResult === true) {
        window.location.reload();
      } else {
        var App = { ...that.state.App };
        App.state = "error";
        that.setState({ App });
      }
    });
  };

  render() {
    return (
      <div>
        <Header key="app-header" changeLangu={this.changeLangu} />
        <div className={styles.app}>{this.getApplication()}</div>
      </div>
    );
  }

  getApplication = function () {
    switch (this.state.App.state) {
      case "ready":
        return (
          <div>
            <Navbar
              key="app-nv"
              JournalSections={this.state.App.JournalSections}
              onNavigate={this.onNavigate}
              NumberTotal={this.state.App.NumberTotal}
              NumberDone={this.state.App.NumberDone}
            />
            {this.getPage()}
          </div>
        );
        break;
      case "error":
        return (
          <ErrorPage
            key="app-ep"
            Type={this.state.App.internetConnection ? "Error" : "Internet"}
            checkConnection={this.checkConnection}
            Handler={this}
          />
        );
        break;
      default:
        return <BusyIndicator key="app-bi" />;
        break;
    }
  };

  getPage = function () {
    return this.state.App.navigating === true ? (
      <div styles={{ "margin-left": "350px" }}>
        <BusyIndicator key="app-bi" />
      </div>
    ) : (
      <Page
        key="app-pa"
        JournalSection={this.state.App.activeSection}
        App={this}
      />
    );
  };

  checkConnection = function (oHandler) {
    if (oHandler.state.App.state !== "checking") {
      var App = { ...oHandler.state.App };
      App.state = "checking";
      oHandler.setState({ App });

      ipcRenderer
        .invoke("is-online")
        .then((online) => oHandler.onIsOnline(online, oHandler));
    }
  };

  onIsOnline = function (bOnline, oHandler) {
    var App = { ...oHandler.state.App };
    App.internetConnection = bOnline;

    if (bOnline !== true) {
      App.ready = false;
      App.state = "error";
    }
    oHandler.setState({ App });

    if (bOnline === true && oHandler.state.App.ready === false) {
      oHandler.requestJournalSections();
    }
  };

  requestJournalSections = async function () {
    ipcRenderer
      .invoke("init-JournalSections")
      .then((aResult) => this.onDataReceived(aResult, this));
  };

  onDataReceived = function (oResult, oHandler) {
    var App = { ...oHandler.state.App };
    if (oResult === null) {
      App.state = "error";
    } else {
      App.state = "ready";
      App.ready = true;
      App.JournalSections = oResult.JournalSections;
      App.JournalSections.forEach((oJournalSection) => {
        oJournalSection.Name =
          oJournalSection.iID === 0 ||
          oJournalSection.iID === 98 ||
          oJournalSection.iID === 99
            ? Text[window.lang][`${oJournalSection.iID}`]
            : oJournalSection.Name;
      });
      App.NumberTotal = oResult.NumberTotal;
      App.NumberDone = oResult.NumberDone;
      App.activeSection = App.JournalSections[0];
    }
    oHandler.setState({ App });
  };

  onNavigate = (oJournalSection) => {
    var App = { ...this.state.App };
    let aJournalSectionsNew = App.JournalSections;
    let iIndex = aJournalSectionsNew.indexOf(oJournalSection);
    if (aJournalSectionsNew[iIndex].iID !== App.activeSection.iID) {
      aJournalSectionsNew.forEach(
        (oJournalSectionNew) => (oJournalSectionNew.isActive = false)
      );
      aJournalSectionsNew[iIndex].isActive = true;
      App.activeSection = aJournalSectionsNew[iIndex];
      App.JournalSections = aJournalSectionsNew;
      App.navigating = true;
      this.setState({ App });
      setTimeout(() => this.onNavigationDone(this), 50);
    }
  };

  onNavigationDone = function (oHandler) {
    var App = { ...oHandler.state.App };
    App.navigating = false;
    oHandler.setState({ App });
  };

  setTotalDone = function (bDone) {
    var App = { ...this.state.App };
    bDone === true ? ++App.NumberDone : --App.NumberDone;
    this.setState({ App });
  };
}

export default App;
