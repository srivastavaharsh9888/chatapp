import React, { Component } from 'react';

class SendMsg extends Component {

  constructor(props) {
      super(props);
    
      this.state = {"message":""};
      this.messageSubmit = this.messageSubmit.bind(this);
      this.handleChange = this.handleChange.bind(this);
    }
  
  handleChange(event) {
    let obj={}
    obj[event.currentTarget.name]=event.currentTarget.value;
    this.setState(obj);
  }
  
  messageSubmit(){
    this.props.sendMessage(this.state.message)
    this.setState({"message":""})
  }

  render() {
    const { notes, getNote, deleteNote } = this.props;

    return (
      <div className="row send-wrap">
        <div className="send-message">
          <div className="message-text">
            <textarea name="message" onChange={this.handleChange} value={this.state.message} className="no-resize-bar form-control" rows="2" placeholder="Write a message..."></textarea>
          </div>
          <div className="send-button">
            <a className="btn" onClick={this.messageSubmit}>Send <i className="fa fa-send"></i></a>
          </div>
        </div>
      </div>
    );
  }
}

export default SendMsg;