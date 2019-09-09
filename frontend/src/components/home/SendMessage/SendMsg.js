import React, { Component } from 'react';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'

//component used to send message to the single channel
class SendMsg extends Component {

  constructor(props) {
      super(props);
    
      this.state = {"message":""};
      this.messageSubmit = this.messageSubmit.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleEnter = this.handleEnter.bind(this);
    }
  
  //send message onn press of the enter key  
  handleEnter(event){
    if(event.keyCode==13 && this.state.message){
      this.messageSubmit();
      this.setState({"message":""})
    }
  }  

  //set the value of the input field
  handleChange(event) {
    let obj={}
    obj[event.currentTarget.name]=event.currentTarget.value;
    this.setState(obj);
  }
  
  //submit the message on submitting the send button
  messageSubmit(){
    if(this.state.message){
      this.props.sendMessage(this.state.message)
      this.setState({"message":""})
    }
  }

  //function that add a emoji to the message
  addEmoji = (e) => {
      let emoji = e.native;
      this.setState({
        message: this.state.message + emoji
      })
  }
  
  //function to the show the emoji box
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
            <textarea name="message" onChange={this.handleChange} onKeyDown={this.handleEnter} value={this.state.message} className="no-resize-bar form-control" rows="2" placeholder="Write a message..."></textarea>
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