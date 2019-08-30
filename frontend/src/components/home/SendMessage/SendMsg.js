import React, { Component } from 'react';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'

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

  addEmoji = (e) => {
      let emoji = e.native;
      this.setState({
        message: this.state.message + emoji
      })
  }
  
  showEmoji = () =>{
    let k=document.getElementById("show")
    if(k.style.display=="none")
      k.style.display="block"
    else
      k.style.display="none"

  }
  
  render() {
    return (
      <div className="row send-wrap">
        <div id="show" style={{display:"none",position:"absolute",top:"5%",right:"0%"}}>
           <Picker onSelect={this.addEmoji} />
        </div>
        <div className="send-message">
          <div className="message-text">
            <textarea name="message" onChange={this.handleChange} value={this.state.message} className="no-resize-bar form-control" rows="2" placeholder="Write a message..."></textarea>
          </div>
          <div className="send-button">
            <a className="btn" onClick={this.messageSubmit}>Send <i className="fa fa-send"></i></a>
            <button onClick={this.showEmoji}>Emoji</button>
          </div>
        </div>
      </div>
    );
  }
}

export default SendMsg;