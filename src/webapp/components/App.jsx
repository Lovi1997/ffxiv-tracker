import React, { Component } from "react";
import Navbar from "./Navbar";
import BusyIndicator from "./BusyIndicator";
import Header from "./Header";
import ErrorPage from "./ErrorPage";
import Page from "./Page";
import styles from "../css/App.module.css";

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
      },
    };

    this.checkConnection(this);
  }

  render() {
    return (
      <div>
        <Header key="app-header" />
        <div className={styles.app}>{this.getApplication()}</div>
      </div>
    );
  }

  getApplication = function () {
    switch (this.state.App.state) {
      case "ready":
        return (
          <React.Fragment>
            <Navbar
              key="app-nv"
              JournalSections={this.state.App.JournalSections}
              onNavigate={this.onNavigate}
            />
            <Page key="app-pa" JournalSection={this.state.activeSection} />
          </React.Fragment>
        );
        break;
      case "error":
        return (
          <ErrorPage
            key="app-ep"
            Type={this.state.App.internetConnection ? "Error" : "Internet"}
            checkConnection={this.checkConnection}
            App={this}
          />
        );
        break;
      default:
        return <BusyIndicator key="app-bi" />;
        break;
    }
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
      .then((oResult) => this.onJournalSectionsReceived(oResult, this));
  };

  onJournalSectionsReceived = function (oResult, oApp) {
    var App = { ...oApp.state.App };
    if (oResult === null) {
      App.state = "error";
    } else {
      App.state = "ready";
      App.ready = true;
      App.JournalSections = oResult.aJournalSections;
      App.activeSection = App.JournalSections[0];
    }
    oApp.setState({ App });
  };

  onNavigate = (oJournalSection) => {
    var App = { ...this.state.App };
    let aJournalSectionsNew = App.JournalSections;
    let iIndex = aJournalSectionsNew.indexOf(oJournalSection);
    aJournalSectionsNew.forEach(
      (oJournalSectionNew) => (oJournalSectionNew.isActive = false)
    );
    aJournalSectionsNew[iIndex].isActive = true;
    App.activeSection = aJournalSectionsNew[iIndex].ID;
    App.JournalSections = aJournalSectionsNew;
    this.setState({ App });
  };
}

export default App;
