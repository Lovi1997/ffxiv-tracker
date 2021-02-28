import React, { Component } from "react";
import styles from "../css/QuestTable.module.css";

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
          <th>Test 1</th>
          <th>Test 2</th>
          <th>Test 3</th>
        </tr>
      </thead>
    );
  };

  getFooter = function () {
    return (
      <tfoot>
      </tfoot>
    );
  };

  getBody = function () {
    return (
      <tbody>
        <tr>
          <td>Test 1</td>
          <td>Test 2</td>
          <td>Test 3</td>
        </tr>
        <tr>
          <td>Test 1</td>
          <td>Test 2</td>
          <td>Test 3</td>
        </tr>
        <tr>
          <td>Test 1</td>
          <td>Test 2</td>
          <td>Test 3</td>
        </tr>
      </tbody>
    );
  };
}

export default QuestTable;
