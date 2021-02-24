import React, { Component } from 'react';
import styles from "../css/Page.module.css";

class Page extends Component {
    state = { error: this.props.error }
    render() { 
        return ( <h1 className={styles.page}>{this.state.error === false ? "Error" : "No Internet Connection"}</h1> );
    }
}
 
export default Page;