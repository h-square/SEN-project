import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../Header'

class Home extends Component {
  render() {
    return (
      <div className="App">
        <body class="home">
          <Header/>
          <div class="wrapper">
            <div class="sidebar">
              <ul>
                <li><Link to='./reports'>Annual Reports</Link></li>
                <br/>
                <li><Link to='./indicators'>Technical Indicators</Link></li>
                <br/>
                <li><Link to='./optsim'>Option Simulator</Link></li>
                <br/>
                <li><Link to='./peercomp'>Peer Comparison</Link></li>
              </ul> 
            </div>
          </div>
          
        </body>
      </div>
    );
  }
}
export default Home;