import React, { Component } from 'react';

import auth from './../../authguard/auth';
import './nav.css';

//component to show the navbar
class Nav extends Component {
  render() {

    return (
      <div className="nav-container">
        <div className="nav-logo">Chat App</div>
        <div className="nav-button" onClick={() => auth.logout(()=>{
            window.location.reload();
        })} >
          { auth.isAuthenticated() ? 'Logout' :  'Sign In' }
        </div>
      </div>
    );
  }
}

export default Nav;
