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
          {this.getBody()}
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
    return <tfoot></tfoot>;
  };

  getBody = function () {
    return (
      <tbody>
        <QuestItem />
      </tbody>
    );
  };
}

export default QuestTable;
