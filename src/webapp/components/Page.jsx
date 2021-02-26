import React, { Component } from "react";
import styles from "../css/Page.module.css";
import BusyIndicator from "./BusyIndicator";

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
    return (
      <div className={styles.page}>
        <BusyIndicator />
      </div>
    );
  }

  getPage = function () {
    switch (this.state.App.state) {
      case "detail":
        return <h1>Page is ready</h1>;
        break;
      case "search":
        return <h1>Page is ready</h1>;
        break;
      case "error":
        return (
          <ErrorPage
            key="pa-error"
            Type={this.state.Page.internetConnection ? "Error" : "Internet"}
            checkConnection={this.checkConnection}
            App={this}
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
        oHandler.requestData(this.state.JournalSection);
      }
    }
  };

  requestData = function () {};
}

export default Page;
