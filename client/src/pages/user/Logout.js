import React, { Component } from 'react';
import { changeLogin } from '../../actions/postActions';
import { connect } from 'react-redux';

class Logout extends Component{
    render(){
        this.props.changeLogin(false)
        this.props.history.push('/')
        return(
            <div></div>
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
  
export default connect(mapStateToProps, mapDispatchToProps)(Logout);
