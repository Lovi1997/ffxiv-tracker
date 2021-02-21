import React, { Component } from "react";
import styles from "../css/Navbar.module.css";
import BusyIndicator from "./BusyIndicator";
import NavbarItem from "./NavbarItem";

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      JournalSections: this.props.JournalSections,
    };
  }

  onActivate = (oJournalSection) => {
    var JournalSectionsNew = [...this.state.JournalSections];
    var iIndex = JournalSectionsNew.indexOf(oJournalSection);
    JournalSectionsNew.forEach(
      (JournalSectionNew) => (JournalSectionNew.isActive = false)
    );
    JournalSectionsNew[iIndex].isActive = true;
    this.setState({ JournalSectionsNew });
  };

  getNavbarItems = function () {
    return this.state.JournalSections.map((oJournalSection) => {
      return (
        <NavbarItem
          key={"nvi-" + oJournalSection.ID}
          onActivate={this.onActivate}
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
