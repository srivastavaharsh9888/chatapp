import React, { Component } from 'react';
import './online-card.css';

class OnlineCard extends Component {

  render() {
    const { online_user } = this.props;
    return(
      <div className="conversation btn">
        <div className="media-body">
          <h5 className="media-heading" id="contactName">{online_user.first_name}</h5>
          <h5 className="media-heading" id="contactName">{online_user.username}</h5>
            <small className="pull-right time">Online</small>
        </div>
      </div>
    );
  }
}

export default OnlineCard;