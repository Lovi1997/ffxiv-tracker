import React, { Component } from 'react';
const { ipcRenderer } = window.require('electron');

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    handelOnClick = function() {
        console.log("Test Pressed");
        ipcRenderer.send('updateContent', false);
    }

    render() { 
        return ( <button onClick={this.handelOnClick}>Test</button> );
    }
}
 
export default Navbar;