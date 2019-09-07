import React, { Component } from 'react';

import auth from './../../authguard/auth';
import './nav.css';

class Nav extends Component {
  render() {
    let {toggleVideo,videoAllowed,showButton}=this.props;

    return (
      <div className="nav-container">
        <div className="nav-logo">Chat App</div>
        <div className="nav-button" onClick={() => auth.logout(()=>{
            window.location.reload();
        })} >
          { auth.isAuthenticated() ? 'Logout' :  'Sign In' }
        </div>
        { 
          showButton ?  
          <div style={{fontSize:12}} onClick={() => toggleVideo()} className={videoAllowed ? "nav-button abc":"nav-button"} >Allow Video Chat</div> :
          <div></div>
        }

      </div>
    );
  }
}

export default Nav;
