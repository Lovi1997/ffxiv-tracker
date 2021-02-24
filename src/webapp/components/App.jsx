import React, { Component } from "react";
import Navbar from "./Navbar";
import BusyIndicator from "./BusyIndicator";
import Header from "./Header";
import ErrorPage from "./ErrorPage";
import Page from "./Page";
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
      },
    };

    this.checkConnection(this);
  }

  render() {
    return (
      <div>
        <Header key="app-header" />
        {this.getApplication()}
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
            />
            <Page state="Error" />
          </div>
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
    }
  };

  checkConnection = function (oHandler) {
    if (oHandler.state.App.state !== "checking") {
      var App = { ...oHandler.state.App };
      App.state = "checking";
      oHandler.setState({ App });
      console.log(App.internetConnection);

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
      console.log(App.internetConnection);
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
    }
    oApp.setState({ App });
  };
}

export default App;
