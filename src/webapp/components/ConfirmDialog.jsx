import React, { Component } from "react";
import styles from "../css/ConfirmDialog.module.css";
import Text from "../i18n/ConfirmDialog.json";
const { ipcRenderer } = window.require("electron");

class ConfirmDialog extends Component {
  state = {};

  render() {
    return (
      <div className={styles.overlay}>
        <div className={styles.popup}>
          <h2>{Text[window.lang]["Title"]}</h2>
          <div className={styles.content}>
            {Text[window.lang]["UpdateAvailable"]}
          </div>
          <button
            onClick={() => this.onInstall()}
            className={styles.confirmButton}
          >
            {Text[window.lang]["Restart"]}
          </button>
        </div>
      </div>
    );
  }

  onInstall = function () {
    ipcRenderer.send("restart_app");
  };
}

export default ConfirmDialog;
