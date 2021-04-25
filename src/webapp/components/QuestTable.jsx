import React, { Component } from "react";
import styles from "../css/QuestTable.module.css";
import QuestItem from "./QuestItem";
import Text from "../i18n/QuestTable.json";

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
          <th className={styles.name}>{Text[window.lang]["Name"]}</th>
          <th className={styles.jobs}>Jobs</th>
          <th className={styles.level}>{Text[window.lang]["Level"]}</th>
          <th className={styles.category}>{Text[window.lang]["Category"]}</th>
          <th className={styles.location}>{Text[window.lang]["Location"]}</th>
          <th className={styles.action}>{Text[window.lang]["Action"]}</th>
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
          <th></th>
        </tfoot>
      );
    }
  };

  getMessage = function () {
    return this.props.Quests.length === 0 ? Text[window.lang]["NoEntries"] : "";
  };

  getBody = function () {
    return this.props.Quests.map((oQuest) => {
      return (
        <QuestItem
          key={"qu-item" + oQuest.iID}
          setDone={this.props.setDone}
          Page={this.props.Page}
          Quest={oQuest}
          QuestHandler={this.props.QuestHandler}
          inclPrev={this.props.inclPrev}
        />
      );
    });
  };
}

export default QuestTable;
