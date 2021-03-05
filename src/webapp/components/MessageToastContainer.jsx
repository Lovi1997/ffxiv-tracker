import React, { Component } from "react";
import styles from "../css/MessageToastContainer.module.css";
import MessageToast from "./MessageToast";

class MessageToastContainer extends Component {
  state = {};
  render() {
    return (
      <div className={styles.container}>
        {this.props.Messages.map((oMessage) => {
          return (
            <MessageToast
              key={oMessage.iID}
              Message={oMessage}
              Page={this.props.Page}
            />
          );
        })}
      </div>
    );
  }
}

export default MessageToastContainer;
