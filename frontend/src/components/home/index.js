import React, { Component } from 'react';
import './index.css';
import Nav from './../header/Nav.js';
import OnlineList from './OnlineList/List';
import axios from 'axios';
import urlFor from './../../helpers/urlFor';
import Flash from './../../lib/Flash';
import MessageList from './MessageList/MsgList';
import SendMessage from './SendMessage/SendMsg';
import Video from './../video/video.js';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';

//setting for configuration of each API request
axios.interceptors.request.use((config) => {
 
 //get the token from the local storage
 let token=window.localStorage.getItem("token")
  if (token) {
    //attach the token to headers of every request
    config.headers['authorization'] = 'Token ' + token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

let socket=null;

class Home extends Component {
  constructor() {
    super();
    this.state = {
      online_users:[],
      error: '',
      messageList:[],
      videoCalling:false,
      personCalled:"",
      showCallBox:false,
      initiator:null,
      personCalling:"",
      yourId:"",
      msgCall:"",
      show2:false,
      allMessage:""
    };
  }

  componentWillMount() {
    let self=this;

    //making a socket connection
    socket=new WebSocket('wss://chatingbunny.herokuapp.com/ws/chat/all/');

    //event handler to get the online user list as soon as the socket connection is open
    socket.addEventListener('open', function (event) {
        socket.send(JSON.stringify({"type":"online_users","token":window.localStorage.getItem("token")}));
    });
    
    //event handler for managing error if socket connection cannot be made
    socket.addEventListener('error', function (m) { 
        alert("Heroku Dynamo Might be sleeping Plz try again by refreshing the page"); 
        window.location.reload();
    });

    // Listen for messages and each message has a handle_type which decide the operation to be executed
    socket.addEventListener('message', function (event) {
        let res=JSON.parse(event.data)

        //if the handle_type is message then append the message to message list
        if(res["handle_type"]==="message"){
          let messageList=self.state.messageList;
          messageList.push(res)

          //as soon as it receive the message automatic scroll down to the end of page
          self.setState({"messageList":messageList},
            ()=>{
                let l=window.document.getElementById("autoscroll") 
                l.scrollTo(0,l.scrollHeight)   
            })
        }
        
        //if the handle type is callComing then show a dialouge box for the incoming call
        else if(res["handle_type"]==="callComing"){

          //get the current user username
          let myUsername=JSON.parse(window.localStorage.getItem("userLoggedInData")).data.username

          //is the user called is current user then show the box and he is not on another call then show the call box
          if(res["personCalled"]===myUsername){
             
            //if the person is not on the other call then show the box for the call comoinng 
            if(self.state.videoCalling===false){
              self.setState({"msgCall":res["personCalling"]+" wants to have a video chat with you"})
              self.setState({showCallBox:true,personCalled:res["personCalled"],personCalling:res["personCalling"]});
            }
          else{
            // if the person is on another call send message that he is busy
            self.sendCallDetails({"personCalled":self.state.personCalled,
                                    type:"callAccept",
                                    personCalling:res["personCalling"],
                                    accept:false,
                                    message:"He is on another call try after sometime."
                                })            
            }
          }
        }

        //this part helps to manage whether the call is accepted or rejected
        else if(res["handle_type"]==="callAccept"){
          let myUsername=JSON.parse(window.localStorage.getItem("userLoggedInData")).data.username
          if(res["personCalling"]===myUsername){

            //if the call is accepted open the video call screen
            if(res["accept"]==true){

              //if the person is not on another call accept the call else reject the call
              if(!self.state.videoCalling){
                self.setState({initiator:false,otherId:res['id'],videoCalling:true});
              }
              else{
                self.sendCallDetails({"personCalled":self.state.personCalled,
                  type:"callAccept",
                  personCalling:self.state.personCalling,
                  accept:false,
                  message:"He is on another call try after sometime."
                })
              }
            }

            // if the person reject the call show thew apprpriate message to the user 
            else{
              self.setState({allMessage:res["message"],show2:true});              
            }
          }
        }

        //exchange id of the users who want to communicate
        else if(res["handle_type"]==="myIdAdd"){
          let myUsername=JSON.parse(window.localStorage.getItem("userLoggedInData")).data.username
          if(res["personCalled"]===myUsername){
            self.setState({yourId:res['id']});
          }
        }

        //set the list of online users
        else if(res["handle_type"]==="online_users"){
            self.setState(res)
        }
    });
  }

  //on picking up the call
  onCallPickUp=()=>{
    this.setState({showCallBox:false,videoCalling:true,initiator:true})
  }

  //on rejection of call
  onCallReject=()=>{
    this.setState({showCallBox:false,videoCalling:false})    
    let token=window.localStorage.getItem("token")
    socket.send(JSON.stringify({"type":"callAccept","personCalling":this.state.personCalling,"token":token,"message":"Sorry the person is not picking up the call","accept":false}));
  }

  //send message to the channel
  sendMsg= (value)=> {
      let token=window.localStorage.getItem("token")
      if(value){
       socket.send(JSON.stringify({"type":"message","token":token,"message":value}));
      }
  }

  //for calling the person
  callPerson=(data,username)=>{
    if(JSON.parse(window.localStorage.getItem("userLoggedInData")).data.username==username)
    {
      alert("You can't call yourself..")
      return
    }
    this.setState({allMessage:"Hello waiting for the response..",show2:true})
    this.setState({personCalled:username,personCalling:JSON.parse(window.localStorage.getItem("userLoggedInData")).data.username,initiator:false});
    let token=window.localStorage.getItem("token");
    data["token"]=token;
    if(data){
      socket.send(JSON.stringify(data));
    }    
  }

  //send the details of the person calling to each other
  sendCallDetails=(data)=>{
   let token=window.localStorage.getItem("token")
    data["token"]=token
    if(data){
       socket.send(JSON.stringify(data));
      } 
  }

  //get the list of all messages 
  getMessage = () =>{
    axios
    .get(urlFor("ListMessage/"))
    .then(res => {
        this.setState({"messageList":res.data})
      })
    .catch(res=>{
      this.setState({ error:"Something Went Wrong.." });
    });   
  }   

  resetError = () => {
    this.setState({ error: '' });
  }


  render() {
    const { error } = this.state;

    return (
      <div className="App">
        <Nav/>

        {error && <Flash error={error} resetError={this.resetError} />}
        <br />
        { this.state.videoCalling ?
          <Video
            callPerson={this.callPerson}
            personCalled={this.state.personCalled}
            initiator={this.state.initiator}
            personCalling={this.state.personCalling}
            sendCallDetails={this.sendCallDetails}
            otherId={this.state.otherId}
            yourId={this.state.yourId}
          />:
          <div className="container fill">
            <div className="row chat-wrap">
              <div className="col-sm-3 panel-wrap">
                <div className="col-sm-12 section-wrap">
                  <div className="row header-wrap">
                      <div className="chat-header col-sm-12">
                          <h4 id="username">Online Users</h4>
                      </div>
                  </div>
                  <OnlineList 
                    online_users={this.state.online_users}
                    videoAllowed={true}
                    callPerson={this.callPerson}
                  />
                </div>
              </div>
              <div className="col-sm-9 panel-wrap">
                <div className="col-sm-12 section-wrap" id="Messages">
                  <div className="row header-wrap">
                      <div className="chat-header col-sm-12">
                          <h4>Conversation Title</h4>
                          <div className="header-button">
                              <a className="btn pull-right info-btn">
                                  <i className="fa fa-info-circle fa-lg"></i>
                              </a>
                          </div>
                      </div>
                  </div>
                  <MessageList 
                    messageList={this.state.messageList}
                    getMessage={this.getMessage}
                  />
                  <SendMessage 
                    sendMessage={this.sendMsg}
                  />
                </div>
              </div>
            </div>
          </div>
      }
      <SweetAlert
          show={this.state.showCallBox}
          title="Video Call Coming"
          text={this.state.msgCall}
          showCancelButton
          onConfirm={() => this.onCallPickUp()}
          onCancel={this.onCallReject}
        />
        <SweetAlert
          show={this.state.show2}
          title={this.state.allMessage}
          text="Call In Progress!!!"
          onConfirm={() => this.setState({ show2: false })}
        />
      </div>
    );
  }
}

export default Home;
