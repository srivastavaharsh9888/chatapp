import React, { Component } from 'react';
import OnlineCard from './OnlineCard';

class List extends Component {
 
  render() {
    const { online_users,videoAllowed,callPerson } = this.props;

    const cards = online_users.map((username, index) => {
      return (
        <OnlineCard
          key={index}
          index={index}
          online_user={JSON.parse(username)}
          video_allowed={videoAllowed}
          callPerson={callPerson}
        />
      );
    });

    return (
      <div className="row content-wrap">
        {cards}
      </div>
    );
  }
}

export default List;