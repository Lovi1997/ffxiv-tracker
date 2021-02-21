import React, { Component } from 'react';

class Page extends Component {
    state = { error: this.props.error }
    render() { 
        return ( <h1>{this.state.error === false ? "Error" : "No Internet Connection"}</h1> );
    }
}
 
export default Page;