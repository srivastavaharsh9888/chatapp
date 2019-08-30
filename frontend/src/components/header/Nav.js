import React, { Component } from 'react';
        // <div className="nav-button" onClick={() => toggleNote()} >
        //   { showNote ? 'Cancel' :  '+ Note' }
        // </div> 

import auth from './../../authguard/auth';
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
