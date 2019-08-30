import React, { Component } from 'react';
import OnlineCard from './OnlineCard';

class List extends Component {
 
  render() {
    const { online_users } = this.props;

    const cards = online_users.map((username, index) => {
      return (
        <OnlineCard
          key={index}
          index={index}
          online_user={JSON.parse(username)}
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