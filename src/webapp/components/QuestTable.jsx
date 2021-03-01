import React, { Component } from "react";
import styles from "../css/QuestTable.module.css";
import QuestItem from "./QuestItem";

class QuestTable extends Component {
  state = {};
  render() {
    return (
      <div className={styles.wrapper}>
        <table className={styles.table}>
          {this.getHeader()}
          {this.getFooter()}
          <tbody>{this.getBody()}</tbody>
        </table>
      </div>
    );
  }

  getHeader = function () {
    return (
      <thead>
        <tr>
          <th className={styles.icon}></th>
          <th className={styles.name}>Name</th>
          <th className={styles.level}>Level</th>
          <th className={styles.category}>Kategorie</th>
          <th className={styles.location}>Location</th>
          <th className={styles.action}>Action</th>
        </tr>
      </thead>
    );
  };

  getFooter = function () {
    if (this.props.Quests.length === 0) {
      return (
        <tfoot>
          <th></th>
          <th>{this.getMessage()}</th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
        </tfoot>
      );
    }
  };

  getMessage = function () {
    return this.props.Quests.length === 0 ? "Keine Einträge vorhanden" : "";
  };

  getBody = function () {
    return this.props.Quests.map((oQuest) => {
      return (
        <QuestItem
          key={"qu-item" + oQuest.iID}
          setDone={this.props.setDone}
          Page={this.props.Page}
          Quest={oQuest}
        />
      );
    });
  };
}

export default QuestTable;
