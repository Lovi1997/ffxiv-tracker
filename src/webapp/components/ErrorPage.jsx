import React, { Component } from "react";
import styles from "../css/ErrorPage.module.css";

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
        <div className={styles.text}>
          Leider wurde die Internetverbindung unterbrochen.
        </div>
        <div className={styles.text}>Retrying in {this.state.Error.Time}.</div>
      </div>
    );
  };

  getDefaultError = function () {
    return (
      <div className={styles.errorpage}>
        <div className={styles.text}>
          Ein unerwarteter Fehler ist aufgetreten.
        </div>
        <div className={styles.text}>Bitte versuche es später erneut.</div>
        <div className={styles.text}>Optional: Siehe Logs.</div>
      </div>
    );
  };

  setTime() {
    var Error = { ...this.state.Error };
    if (Error.Time > 0) {
      Error.Time = Error.Time - 1;
      console.log(Error.Time);
      this.setState({ Error });
      var that = this;
      setTimeout(() => that.setTime(), 1000);
    } else {
      this.props.checkConnection(this.props.App);
    }
  }
}
export default ErrorPage;
