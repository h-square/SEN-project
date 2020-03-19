import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class Home extends Component {
  render() {
    return (
    <div className="App">
      <h1>SMAP Home</h1>
      
      <Link to={'./indicators'}>
        <button variant="raised">
            Technical Indicators
        </button>
      </Link>
      
      <br />
      <br />

      <Link to={'./optsim'}>
        <button variant="raised">
            Option Simulator
        </button>
      </Link>
    </div>
    );
  }
}
export default Home;