import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../Header';
import { connect } from 'react-redux';
import { changeLogin } from '../../actions/postActions';

class Home extends Component {
  render() {
    let watchlist=this.props.loggedin?(
      <li><Link to='./watchlist'>Watchlist</Link></li>
    ):(null)
    return (
      <div className="App">
        <div className="home">
          <Header/>
          <div className="wrapper">
            <div className="sidebar">
              <ul>
                <li><Link to='./reports'>Annual Reports</Link></li>
                <br/>
                <li><Link to='./indicators'>Technical Indicators</Link></li>
                <br/>
                <li><Link to='./optsim'>Option Simulator</Link></li>
                <br/>
                <li><Link to='./peercomp'>Peer Comparison</Link></li>
                <br/>
                <li><Link to='./dcf'>DCF and Stock Prediction</Link></li>
                <br/>
                {watchlist}
              </ul> 
            </div>
          </div>
          
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
      loggedin: state.loggedin
  }
}
const mapDispatchToProps = (dispatch) =>{
  return {
      changeLogin: (redirectionToUserHome) => {dispatch(changeLogin(redirectionToUserHome))} 
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);