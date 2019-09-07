import React, { Component } from "react";
import "./log.css";
import axios from 'axios';
import urlFor from './../../helpers/urlFor';
import Flash from './../../lib/Flash';
import auth from "./../../authguard/auth";
import Nav from './../header/Nav.js';
import Peer from 'simple-peer';


class Video extends Component {
	constructor(props) {
		super(props);
		if(!auth.isAuthenticated()){
			this.props.history.push("/login")
		}
		this.state = {
			peer:null,
			id:null
		};
	}

	componentDidUpdate(prevProps) {
	  if (prevProps.yourId !== this.props.yourId) {
	  	this.state.peer.signal(this.props.yourId)
	  }
	}

	componentDidMount(){
		let self=this;
		navigator.getUserMedia({video:true,audio:true},function(stream){

			let peerId=null;

			let peer=new Peer({
				initiator:self.props.initiator,
				trickle: false,
				stream:stream,
			})

		  	self.setState({
		  		peer:peer
		  	})
			
			if(!self.props.initiator){
				peer.signal(JSON.parse(self.props.otherId))
			}

			if(self.props.initiator && self.props.yourId){
				peer.signal(JSON.parse(self.props.yourId))
			}		     

		    peer.on('error', err => {
		    	alert("Connection broke Down!! Please make a call again");
		    	window.location.reload();
		    }) 

			peer.on('signal', function (data) {
			  	self.setState({
			  		id:JSON.stringify(data),
			  	},()=>{
			  		let initiator=self.props.initiator
			  		if(initiator){
			  			self.props.sendCallDetails({"personCalled":self.props.personCalled,
			  				type:"callAccept",
			  				personCalling:self.props.personCalling,
			  				id:JSON.stringify(data)})
			  		}
			  		else{
			  			self.props.sendCallDetails({"personCalled":self.props.personCalled,
			  				type:"myIdAdd",
			  				personCalling:self.props.personCalling,
			  				id:JSON.stringify(data)})
			  		}
			  	})
			 })

		  	document.getElementById('send').addEventListener('click', function () {
		    	var yourMessage = document.getElementById('yourMessage').value
		    	yourMessage = JSON.parse(window.localStorage.getItem("userLoggedInData")).data.username+"-:\n "+yourMessage
		    	document.getElementById('messages').textContent += yourMessage + '\n'
		    	if(peer)
			    	peer.send(JSON.stringify({"type":"message","msg":yourMessage}))
			    else{
			    	alert("Connection broke down!! Please make a call again...")
			    	window.location.reload()
			    }
			})

		  	peer.on('data', function (data) {
		  		data=JSON.parse(data)
		  		if(data["type"]=="message")
			    	document.getElementById('messages').textContent += data["msg"] + '\n'
			    else{
					window.location.reload()
			    }
			})

			peer.on('stream', function (stream) {
			    let video = document.createElement('video')
			    document.getElementById("chatBox").appendChild(video)

			    video.srcObject = stream
			    video.play()
		  	})
		},function(err){
			console.log(err)
		})
	}
 	callDisconnect=()=>{
 		if(this.state.peer){
			this.state.peer.send(JSON.stringify({"type":"disconnect"}))
			window.location.reload()
		}
		else{
			alert("Connection broke down!! Please make a call again...")
			window.location.reload()			
		}
 	}
	render() {
		const { error } = this.state;

	return (
		<div>
			<div className="container" id="chatBox">
			    <label>Enter Message:</label><br/>
			    <textarea id="yourMessage"></textarea>
			    <button id="send">send</button>
			    <pre id="messages"></pre>		
			</div>
			<button className="btn btn-danger" onClick={()=>this.callDisconnect()}>End Call</button>
		</div>
    );
  }
}

export default Video;
	
