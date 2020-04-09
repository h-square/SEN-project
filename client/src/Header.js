import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { changeLogin } from './actions/postActions';

class Header extends Component{

  
    //console.log(this.props)
  render(){
    //console.log(this.props)
    let sidebar=this.props.loggedin?(
      <div>
        <ul>
          <li><Link to='./'>Home</Link></li>
          <li><Link to='./Support'>Support</Link></li>
          <li><Link to='/logout'>Logout</Link></li>
        </ul>
      </div>
    ):(
      <div>
        <ul>
          <li><Link to='./'>Home</Link></li>
          <li><Link to='./Support'>Support</Link></li>
          <li><Link to='./login'>Login / Signup</Link></li>
        </ul>
      </div>
    )
    return(
        <header className='navbar'>
            <Link to='./' id="logo" >
              <span className='smap'>SMAP</span> 
            </Link> 
            <nav>
              {sidebar}
            </nav>
        </header>
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

export default connect(mapStateToProps, mapDispatchToProps)(Header);