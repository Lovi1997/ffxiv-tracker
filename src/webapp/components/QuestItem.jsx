import React, { Component } from "react";
import styles from "../css/QuestItem.module.css";

class QuestItem extends Component {
  state = {};
  render() {
    return (
      <tr className={this.getRowStyle()}>
        <td className={styles.icon}></td>
        <td className={styles.name}>{this.props.Quest.Name}</td>
        <td className={styles.level}>{this.props.Quest.Level}</td>
        <td className={styles.category}>{this.props.Quest.JournalCategory}</td>
        <td className={styles.location}>{this.props.Quest.Location}</td>
        <td className={styles.action}>{this.getButton()}</td>
      </tr>
    );
  }

  getRowStyle = function () {
    if (this.props.Quest.Done === true) {
      return styles.doneRow;
    } else {
      return styles.undoneRow;
    }
  };

  getButton = function () {
    if (this.props.Quest.Done === true) {
      return (
        <button
          className={styles.select}
          onClick={() =>
            this.props.setDone(false, this.props.Quest, this.props.Page)
          }
        >
          <i class="fas fa-times"></i>
        </button>
      );
    } else {
      return (
        <button
          className={styles.select}
          onClick={() =>
            this.props.setDone(true, this.props.Quest, this.props.Page)
          }
        >
          <i class="fas fa-check"></i>
        </button>
      );
    }
  };
}

export default QuestItem;
