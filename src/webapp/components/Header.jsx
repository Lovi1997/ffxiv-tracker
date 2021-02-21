import React, { Component } from "react";
import styles from "../css/Header.module.css";

class Header extends Component {
  constructor(props) {
    super(props);
    let dTime = new Date();
    this.state = {
      time: {
        hours: dTime.getHours(),
        minutes: dTime.getMinutes(),
      },
    };
    this.setTime();
  }

  setTime = function () {
    let dTime = new Date();
    let time = {};
    time.minutes = dTime.getMinutes();
    time.hours = dTime.getHours();

    this.setState({ time });

    var that = this;
    setTimeout(() => {
      that.setTime();
    }, 10000);
  };

  getTime = function () {
    let sHours = this.state.time.hours;
    let sMinutes = this.state.time.minutes;

    sMinutes = this.checkTime(sMinutes);
    sHours = this.checkTime(sHours);

    return sHours + ":" + sMinutes;
  };

  checkTime = function (iNumber) {
    if (iNumber < 10) {
      iNumber = "0" + iNumber;
    }
    return iNumber;
  };

  render() {
    return (
      <div>
        <ul className={styles.header}>
          <li className={styles.headeritem}>Icon</li>
          <li className={styles.headeritem}>FFXIV-Tracker</li>
          <li className={styles.headeritem}>v0.5</li>
          <li className={styles.clock}>{this.getTime()}</li>
        </ul>
      </div>
    );
  }
}

export default Header;
