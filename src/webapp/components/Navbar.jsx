import React, { Component } from "react";
import styles from "../css/Navbar.module.css";
import NavbarItem from "./NavbarItem";
import Text from "../i18n/Navbar.json";

class Navbar extends Component {
  state = {
    JournalSections: this.props.JournalSections,
  };

  getNavbarItems = function () {
    return this.props.JournalSections.map((oJournalSection) => {
      return (
        <NavbarItem
          key={"nvi-" + oJournalSection.iID}
          onActivate={this.props.onNavigate}
          JournalSection={oJournalSection}
        />
      );
    });
  };

  render() {
    return (
      <div className={styles.navbar}>
        {this.getNavbarItems()}
        <div className={styles.totalDisplay}>
          <div className={styles.totalText}>{Text[window.lang]["Done"]}</div>
          <div className={styles.totalNumber}>
            {this.props.NumberDone}/{this.props.NumberTotal}
          </div>
        </div>
      </div>
    );
  }
}

export default Navbar;
