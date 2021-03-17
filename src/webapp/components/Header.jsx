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
          <li className={styles.leftimage}>
            <img className={styles.headerimage} src={`./icons/header.png`} />
          </li>
          <li className={styles.left}>FFXIV-Tracker</li>
          <li className={styles.left}>{this.getVersion()}</li>
          <li className={styles.right}>{this.getTime()}</li>
          <li className={styles.dropdown}>
            <div className={styles.langu}>
              <select
                onChange={(event) => this.props.changeLangu(event.target.value)}
                value={window.lang}
              >
                <option value="de">DE</option>
                <option value="en">EN</option>
              </select>
            </div>
          </li>
        </ul>
      </div>
    );
  }

  getVersion = function () {
    return this.props.updateAvailable ? (
      <i class="fa fa-spinner fa-spin"></i>
    ) : (
      <div>v{this.props.Version}</div>
    );
  };
}

export default Header;
