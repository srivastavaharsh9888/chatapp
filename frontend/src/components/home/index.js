import React, { Component } from 'react';
import './index.css';
import Nav from './../header/Nav.js';
import OnlineList from './OnlineList/List';
import axios from 'axios';
import urlFor from './../../helpers/urlFor';
import Flash from './../../lib/Flash';
import MessageList from './MessageList/MsgList';
import SendMessage from './SendMessage/SendMsg';
import openSocket from 'socket.io-client';

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
      messageList:[]
    };
  }

  componentWillMount() {
    let self=this;
    socket=new WebSocket('wss://chatingbunny.herokuapp.com/ws/chat/all/');
    socket.addEventListener('open', function (event) {
        socket.send(JSON.stringify({"type":"online_users","token":window.localStorage.getItem("token")}));
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
        else{
            self.setState(res)
        }
    });  
  }

  sendMsg= (value)=> {
      socket.send(JSON.stringify({"type":"message","token":window.localStorage.getItem("token"),"message":value}));
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

  render() {
    const { error } = this.state;

    return (
      <div className="App">
        <Nav/>
        {error && <Flash error={error} resetError={this.resetError} />}
        <br />
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
      </div>
    );
  }
}

export default Home;
