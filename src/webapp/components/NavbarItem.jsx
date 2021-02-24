import React, { Component } from "react";
import styles from "../css/NavbarItem.module.css";

class NavbarItem extends Component {
  state = {
    JournalSection: this.props.JournalSection
  };

  getClasses = function () {
    let sClasses = styles.navbaritem;
    sClasses =
      this.state.JournalSection.isActive === true
        ? sClasses + " " + styles.active
        : sClasses;
    return sClasses;
  };

  render() {
    return (
      <button
        className={this.getClasses()}
        onClick={() => this.props.onActivate(this.props.JournalSection)}
      >
        {this.getImage()}
        <div className={styles.text}>{this.props.JournalSection.Name}</div>
      </button>
    );
  }

  getImage = function () {
    if (this.props.JournalSection.Icon !== "none") {
      return (
        <div className={styles.wrapper}>
        <img className={styles.image} src={`./icons/i${this.props.JournalSection.Icon}.png`} />
        </div>
      );
    }
  };

}

export default NavbarItem;
