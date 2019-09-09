import React, { Component } from 'react';
import './online-card.css';

class OnlineCard extends Component {

  //to make a video call from the list of online user 
  callPerson(username){
    this.props.callPerson({"type":"makecall","personCalled":username,"personCalling":JSON.parse(window.localStorage.getItem("userLoggedInData")).data.username},username)
  }

  render() {
    const { online_user,video_allowed } = this.props;
    return(
      <div className="conversation btn">
        <div className="media-body">
          <h5 className="media-heading" id="contactName">{online_user.first_name}
            {video_allowed ? 
              <div onClick={()=>this.callPerson(online_user.username)}  style={{float:"right"}}>
                  <i className="fa fa-video-camera" aria-hidden="true"></i> 
              </div>
                : 
              <div></div>
            }
          </h5>          
          <h5 className="media-heading" id="contactName">{online_user.username}</h5>
            <small className="pull-right time">Online</small>
        </div>
      </div>
    );
  }
}

export default OnlineCard;