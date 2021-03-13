import React, { Component } from "react";
import styles from "../css/QuestItem.module.css";
import Text from "../i18n/QuestItem.json";

const { ipcRenderer } = window.require("electron");

class QuestItem extends Component {
  state = {
    QuestItem: {
      loading: false,
    },
  };
  render() {
    return (
      <tr className={this.getRowStyle()}>
        <td className={styles.icon}>{this.getIcon()}</td>
        <td className={styles.name}>{this.props.Quest.Name}</td>
        <td className={styles.level}>{this.props.Quest.Level}</td>
        <td className={styles.category}>{this.props.Quest.JournalCategory}</td>
        <td className={styles.location}>{this.props.Quest.Location}</td>
        <td className={styles.action}>{this.getButton()}</td>
      </tr>
    );
  }

  getIcon = function () {
    if (window.IconIDs.indexOf(this.props.Quest.IconID) === -1) {
      return (
        <img
          className={styles.questImage}
          src={`https://xivapi.com${this.props.Quest.Icon}`}
        />
      );
    } else {
      return (
        <img
          className={styles.questImage}
          src={`./icons/questIcons/${this.props.Quest.IconID}.png`}
        />
      );
    }
  };

  getRowStyle = function () {
    if (this.props.Quest.Done === true) {
      return styles.doneRow;
    } else {
      return styles.undoneRow;
    }
  };

  getButton = function () {
    if (this.state.QuestItem.loading === true) {
      return (
        <button className={styles.select} disabled={true}>
          <i class="fa fa-spinner fa-spin"></i>
        </button>
      );
    } else {
      if (this.props.Quest.Done === true) {
        return (
          <button className={styles.select} onClick={() => this.setDone(false)}>
            <i class="fas fa-times"></i>
          </button>
        );
      } else {
        return (
          <button className={styles.select} onClick={() => this.setDone(true)}>
            <i class="fas fa-check"></i>
          </button>
        );
      }
    }
  };

  setDone = function (bDone) {
    ipcRenderer
      .invoke("saveQuests", [{ iID: this.props.Quest.iID, Done: bDone }])
      .then((bSuccess) => this.onSaved(bDone, bSuccess));

    var QuestItem = { ...this.state.QuestItem };
    QuestItem.loading = true;
    this.setState({ QuestItem });
  };

  onSaved = function (bDone, bSuccess) {
    if (bSuccess !== true) {
      this.props.Page.addMSG(Text[window.lang]["SaveError"], "E");
    }

    setTimeout(() => this.setEnabledState(bDone, bSuccess), 1700);
  };

  setEnabledState = function (bDone, bSuccess) {
    var QuestItem = { ...this.state.QuestItem };
    QuestItem.loading = false;
    this.setState({ QuestItem });

    if (bSuccess === true) {
      this.props.QuestHandler.setDone(bDone, this.props.Quest);
    }
  };
}

export default QuestItem;
