import React, { Component } from "react";
import styles from "../css/Dropdown.module.css";

class Dropdown extends Component {
  state = {};
  render() {
    return (
      <div
        className={styles.select}
        disabled={this.props.disabled}
        onChange={(event) =>
          this.props.onChange(event.target.value, this.props.Handler)
        }
      >
        <select>
          {this.props.Options.map((oOption) => {
            return <option value={oOption.Value}>{oOption.Text}</option>;
          })}
        </select>
      </div>
    );
  }
}
export default Dropdown;
