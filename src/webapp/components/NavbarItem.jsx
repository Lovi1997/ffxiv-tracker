import React, { Component } from "react";
import styles from "../css/NavbarItem.module.css";

class NavbarItem extends Component {
  state = {
    JournalSection: this.props.JournalSection,
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
        {this.props.JournalSection.Name}
      </button>
    );
  }
}

export default NavbarItem;
