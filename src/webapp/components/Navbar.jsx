import React, { Component } from "react";
import styles from "../css/Navbar.module.css";
import NavbarItem from "./NavbarItem";

class Navbar extends Component {
  state = {
    JournalSections: this.props.JournalSections,
  }

  getNavbarItems = function () {
    return this.props.JournalSections.map((oJournalSection) => {
      return (
        <NavbarItem
          key={"nvi-" + oJournalSection.ID}
          onActivate={this.props.onNavigate}
          JournalSection={oJournalSection}
        />
      );
    });
  };

  render() {
    return <div className={styles.navbar}>{this.getNavbarItems()}</div>;
  }
}

export default Navbar;
