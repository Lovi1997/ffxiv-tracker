import React, { Component } from "react";
import checkIcon from "../icons/check.svg";
import errorIcon from "../icons/error.svg";
import infoIcon from "../icons/info.svg";
import styles from "../css/MessageToast.module.css";
import { info } from "winston";

class MessageToast extends Component {
  constructor(props) {
    super(props);
    setTimeout(() => this.delete(), 1500);
  }
  render() {
    var oDisplaySettings = this.getDisplaySettings();
    return (
      <div
        key={this.props.Message.iID}
        className={styles.notification}
        style={{ backgroundColor: oDisplaySettings.Color }}
      >
        <button onClick={() => this.delete()}>X</button>
        <div className={styles.image}>
          <img src={oDisplaySettings.Icon} alt="" />
        </div>
        <div>
          <p className={styles.title}>{oDisplaySettings.Title}</p>
          <p className={styles.message}>{this.props.Message.Text}</p>
        </div>
      </div>
    );
  }

  delete = function () {
    this.props.Page.delMessages(this.props.Message);
  };

  getDisplaySettings = function () {
    var oDisplaySettings = {};
    switch (this.props.Message.Type) {
      case "S":
        oDisplaySettings.Title = "Erfolg";
        oDisplaySettings.Color = "#5cb85c";
        oDisplaySettings.Icon = checkIcon;
        break;
      case "I":
        oDisplaySettings.Title = "Info";
        oDisplaySettings.Color = "#5bc0de";
        oDisplaySettings.Icon = infoIcon;
        break;
      default:
        oDisplaySettings.Title = "Error";
        oDisplaySettings.Color = "#d9534f";
        oDisplaySettings.Icon = errorIcon;
        break;
    }

    return oDisplaySettings;
  };
}

export default MessageToast;
