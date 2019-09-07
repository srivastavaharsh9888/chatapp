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
import SweetAlert from 'sweetalert2-react';

axios.interceptors.request.use((config) => {
 let token=window.localStorage.getItem("token")
  if (token) {
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
      videoAllowed:false,
      videoCalling:false,
      personCalled:"",
      showCallBox:false,
      initiator:null,
      personCalling:"",
      yourId:""
    };
  }

  componentWillMount() {
    let self=this;
    socket=new WebSocket('ws://localhost:8000/ws/chat/all/');
    socket.addEventListener('open', function (event) {
        socket.send(JSON.stringify({"type":"online_users","token":window.localStorage.getItem("token")}));
    });
    
    socket.addEventListener('error', function (m) { 
        alert("Heroku Dynamo Might be sleeping Plz try again by refreshing the page"); 
        window.location.reload();
    });

    // Listen for messages
    socket.addEventListener('message', function (event) {
        let res=JSON.parse(event.data)
        if(res["handle_type"]==="message"){
          let messageList=self.state.messageList;
          messageList.push(res)
          self.setState({"messageList":messageList},
            ()=>{
                let l=window.document.getElementById("autoscroll") 
                l.scrollTo(0,l.scrollHeight)   
            })
        }
        else if(res["handle_type"]==="callComing"){
          let myUsername=JSON.parse(window.localStorage.getItem("userLoggedInData")).data.username
          if(res["personCalled"]===myUsername){
            self.setState({showCallBox:true,personCalled:res["personCalled"],personCalling:res["personCalling"],initiator:true});
          }
        }
        else if(res["handle_type"]==="callAccept"){
          let myUsername=JSON.parse(window.localStorage.getItem("userLoggedInData")).data.username
          if(res["personCalling"]===myUsername){
            self.setState({initiator:false,otherId:res['id'],videoCalling:true});
          }
        }
        else if(res["handle_type"]==="myIdAdd"){
          let myUsername=JSON.parse(window.localStorage.getItem("userLoggedInData")).data.username
          if(res["personCalled"]===myUsername){
            console.log("IAMCASDD",res)
            self.setState({yourId:res['id']});
          }
        }
        else if(res["handle_type"]==="online_users"){
            self.setState(res)
        }
    });
  }


  onCallPickUp=()=>{
    this.setState({showCallBox:false,videoCalling:true})
  }

  sendMsg= (value)=> {
      let token=window.localStorage.getItem("token")
      if(value){
       socket.send(JSON.stringify({"type":"message","token":token,"message":value}));
      }
  }

  callPerson=(data,username)=>{
    if(JSON.parse(window.localStorage.getItem("userLoggedInData")).data.username==username)
    {
      alert("You can't call yourself..")
      return
    }
    this.setState({personCalled:username,personCalling:JSON.parse(window.localStorage.getItem("userLoggedInData")).data.username,initiator:false});
    let token=window.localStorage.getItem("token");
    data["token"]=token;
    if(data){
      socket.send(JSON.stringify(data));
    }    
  }

  sendCallDetails=(data)=>{
   let token=window.localStorage.getItem("token")
      if(data){
       socket.send(JSON.stringify(data));
      } 
  }

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

  toggleVideo = () => {
    let newVideoState=!this.state.videoAllowed;

    this.setState({
      videoAllowed:newVideoState
    })
  }

  render() {
    const { error } = this.state;

    return (
      <div className="App">
        <Nav
          toggleVideo={this.toggleVideo}
          videoAllowed={this.state.videoAllowed}
          showButton={true}
        />
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
                    videoAllowed={this.state.videoAllowed}
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
          title="Call Coming"
          text="getting a call"
          showCancelButton
          onConfirm={() => this.onCallPickUp()}
          onCancel={() => {
            console.log('cancel'); // eslint-disable-line no-console
            this.setState({ show: false });
          }}
          onClose={() => console.log('close')} // eslint-disable-line no-console
        />
      </div>
    );
  }
}

export default Home;
