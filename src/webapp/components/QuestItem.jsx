import React, { Component } from "react";
import styles from "../css/QuestItem.module.css";
import Text from "../i18n/QuestItem.json";
import main from "../../backend/data/Icons/main.png";
import function_normal from "../../backend/data/Icons/function_normal.png";
import function_repeat from "../../backend/data/Icons/function_repeat.png";
import common_repeat from "../../backend/data/Icons/common_repeat.png";
import common_normal from "../../backend/data/Icons/common_normal.png";

const { ipcRenderer } = window.require("electron");

class QuestItem extends Component {
  state = {
    QuestItem: {
      loading: false,
      main: main,
      function_normal: function_normal,
      function_repeat: function_repeat,
      common_repeat: common_repeat,
      common_normal: common_normal,
    },
  };
  render() {
    return (
      <tr className={this.getRowStyle()}>
        <td className={styles.icon}>{this.getIcon()}</td>
        <td className={styles.name}>{this.props.Quest.Name}</td>
        <td className={styles.jobs}>{this.props.Quest.Jobs}</td>
        <td className={styles.level}>{this.props.Quest.Level}</td>
        <td className={styles.category}>{this.props.Quest.JournalCategory}</td>
        <td className={styles.location}>{this.props.Quest.Location}</td>
        <td className={styles.action}>{this.getButton()}</td>
      </tr>
    );
  }

  getIcon = function () {
    return <img className={styles.questImage} src={this.state.QuestItem[this.props.Quest.Icon]} />;
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
      .invoke("saveQuests", [{ iID: this.props.Quest.iID, Done: bDone }], this.props.inclPrev)
      .then((oResult) => this.onSaved(bDone, oResult));

    var QuestItem = { ...this.state.QuestItem };
    QuestItem.loading = true;
    this.setState({ QuestItem });
  };

  onSaved = function (bDone, oResult) {
    if (oResult.Success !== true) {
      this.props.Page.addMSG(Text[window.lang]["SaveError"], "E");
    }

    if (oResult.Reload === false) {
      setTimeout(() => this.setEnabledState(bDone, oResult), 1700);
    } else {
      this.setEnabledState(bDone, oResult);
    }
  };

  setEnabledState = function (bDone, oResult) {
    var QuestItem = { ...this.state.QuestItem };
    QuestItem.loading = false;
    this.setState({ QuestItem });

    if (oResult.Success === true) {
      this.props.QuestHandler.setDone(bDone, this.props.Quest, oResult.Reload, oResult.Changed);
    }
  };
}

export default QuestItem;
