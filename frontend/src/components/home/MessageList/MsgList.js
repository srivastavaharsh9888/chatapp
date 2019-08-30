import React, { Component } from 'react';

class MsgList extends Component {
  componentWillMount() {    
    this.props.getMessage();
  }

  render() {
    const { messageList } = this.props;
    const cards = messageList.map((message, index) => {
      return (
        <div className="msg" key={index}>
          <div className="media-body">
            <small className="pull-right time"><i className="fa fa-clock-o"></i></small>
              <h5 className="media-heading">{message.first_name} &nbsp; ({message.username})</h5>
              <small className="col-sm-11">{message.message}</small>
          </div>
        </div>      
      );
    });

    return (
      <div className="row content-wrap messages" id="autoscroll"> 
        {cards}
      </div>
    );
  }
}

export default MsgList;