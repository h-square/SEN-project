import React from 'react';
import { Link } from 'react-router-dom';

const Header =() =>{
    return(
        <header className='navbar'>
            <a id="logo" href="./">
              <span className='smap'>SMAP</span> 
            </a> 
            <nav>
              <ul>
                <li><Link to='./'>Home</Link></li>
                <li><Link to='./Support'>Support</Link></li>
                <li><Link to='./login'>Login/SignUp</Link></li>
              </ul>
            </nav>
        </header>
    );
}
export default Header;