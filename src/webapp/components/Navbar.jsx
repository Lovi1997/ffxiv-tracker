import React, { Component } from "react";
import styles               from "../css/Navbar.module.css";
import BusyIndicator        from "./BusyIndicator";
import NavbarItem           from "./NavbarItem";
const { ipcRenderer } = window.require("electron");

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: false,
      ready: false,
      JournalSections: [] 
    }
  }

  onActivate = (oJournalSection) => {
    var JournalSectionsNew = [...this.state.JournalSections];
    var iIndex = JournalSectionsNew.indexOf(oJournalSection);
    JournalSectionsNew.forEach(
      (JournalSectionNew) => (JournalSectionNew.bActive = false)
    );
    JournalSectionsNew[iIndex].bActive = true;
    this.setState({ JournalSectionsNew });
  };

  getNavbarItems = function () {
    return this.state.JournalSections.map((oJournalSection) => {
      return (
        <NavbarItem
          key={"js-" + oJournalSection.iID}
          onActivate={this.onActivate}
          oJournalSection={oJournalSection}
        />
      );
    });
  };

  render() {
      return <BusyIndicator/>;
      //return <div className={styles.navbar}>{this.getNavbarItems()}</div>;
  }
}

export default Navbar;
