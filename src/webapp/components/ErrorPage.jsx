import React, { Component } from "react";
import styles from "../css/ErrorPage.module.css";
import Text from "../i18n/ErrorPage.json";

class ErrorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Error: {
        Type: this.props.Type,
        Time: 60,
      },
    };
    this.props = props;

    if (this.state.Error.Type === "Internet") {
      this.setTime();
    }
  }

  render() {
    return this.getErrorType();
  }

  getErrorType = function () {
    switch (this.state.Error.Type) {
      case "Internet":
        return this.getInternetError();
        break;
      default:
        return this.getDefaultError();
        break;
    }
  };

  getInternetError = function () {
    return (
      <div className={styles.errorpage}>
        <div className={styles.text}>{Text[window.lang]["ReasonI"]}</div>
        <div className={styles.text}>
          {Text[window.lang]["Next"]} {this.state.Error.Time}.
        </div>
      </div>
    );
  };

  getDefaultError = function () {
    return (
      <div className={styles.errorpage}>
        <div className={styles.text}>{Text[window.lang]["ReasonE"]}</div>
        <div className={styles.text}>{Text[window.lang]["Later"]}</div>
        <div className={styles.text}>{Text[window.lang]["Log"]}</div>
      </div>
    );
  };

  setTime() {
    var Error = { ...this.state.Error };
    if (Error.Time > 0) {
      Error.Time = Error.Time - 1;
      this.setState({ Error });
      var that = this;
      setTimeout(() => that.setTime(), 1000);
    } else {
      this.props.checkConnection(this.props.Handler);
    }
  }
}
export default ErrorPage;
