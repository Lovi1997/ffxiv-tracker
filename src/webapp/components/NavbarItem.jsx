import React, { Component } from "react";
import styles from "../css/NavbarItem.module.css";

class NavbarItem extends Component {
  state = {
    JournalSection: this.props.oJournalSection,
  };

  getClasses = function () {
    let sClasses = styles.navbaritem;
    sClasses =
      this.state.JournalSection.bActive === true
        ? sClasses + " " + styles.active
        : sClasses;
    return sClasses;
  };

  render() {
    return (
      <button
        className={this.getClasses()}
        onClick={() => this.props.onActivate(this.props.oJournalSection)}
      >
        {this.props.oJournalSection.sText}
      </button>
    );
  }
}

export default NavbarItem;
