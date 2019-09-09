import React, { Component } from "react";
import "./log.css";
import auth from "./../../authguard/auth";
import Peer from 'simple-peer';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';


class Video extends Component {
	constructor(props) {
		super(props);
		if(!auth.isAuthenticated()){
			this.props.history.push("/login")
		}
		this.state = {
			peer:null,
			id:null,
			show:false
		};
	}

	//update the user id if the yourId props is changed by the home component
	componentDidUpdate(prevProps) {
	  if (prevProps.yourId !== this.props.yourId) {
	  	this.state.peer.signal(this.props.yourId)
	  }
	}

	componentDidMount(){
		let self=this;

		//get the access permissiong of the user video camera and audio
		navigator.mediaDevices.getUserMedia({video:true,audio:true})
		.then(function(stream){

			//show your video
		    let video = document.createElement('video')
		    document.getElementById("chatBox").appendChild(video)

		    video.srcObject = stream
		    video.play()

		    //show a diaglogue box for the connection making in progress
			self.setState({show:true})

			//setup a new object for the peer
			let peer=new Peer({
				initiator:self.props.initiator,
				trickle: false,
				stream:stream,
			})

		  	self.setState({
		  		peer:peer
		  	})
			
			//if you have initated the call execute the following line
			if(!self.props.initiator){
				peer.signal(JSON.parse(self.props.otherId))
			}

			if(self.props.initiator && self.props.yourId){
				peer.signal(JSON.parse(self.props.yourId))
			}		     

			//if there is any problem in making a connection show user a box and reload the page
		    peer.on('error', err => {
		    	alert("Connection broke Down!! Please make a call again");
		    	window.location.reload();
		    }) 

		    //when ever a signal is added to the peer
			peer.on('signal', function (data) {
			  	self.setState({
			  		id:JSON.stringify(data),
			  	},()=>{
			  		let initiator=self.props.initiator
			  		if(initiator){
			  			self.props.sendCallDetails({"personCalled":self.props.personCalled,
			  				type:"callAccept",
			  				personCalling:self.props.personCalling,
			  				id:JSON.stringify(data),
			  				accept:true
			  			})
			  		}
			  		else{
			  			self.props.sendCallDetails({"personCalled":self.props.personCalled,
			  				type:"myIdAdd",
			  				personCalling:self.props.personCalling,
			  				id:JSON.stringify(data)})
			  		}
			  	})
			 })

			//event handler for sending message one to one
		  	document.getElementById('send').addEventListener('click', function () {

		  		//get the message from the input box
		    	var yourMessage = document.getElementById('yourMessage').value

		    	//append your username to it
		    	yourMessage = JSON.parse(window.localStorage.getItem("userLoggedInData")).data.username+"-:\n "+yourMessage
		    	document.getElementById('messages').textContent += yourMessage + '\n'

		    	//send the meessge else show the message to the user of connection break down
		    	if(peer){
			    	peer.send(JSON.stringify({"type":"message","msg":yourMessage}))
			    	document.getElementById('yourMessage').value=""
		    	}
			    else{
			    	alert("Connection broke down!! Please make a call again...")
			    	window.location.reload()
			    }
			})

		  	//event handler when ever the message is received
		  	peer.on('data', function (data) {
		  		data=JSON.parse(data)
		  		if(data["type"]=="message")
			    	document.getElementById('messages').textContent += data["msg"] + '\n'
			    else{
					window.location.reload()
			    }
			})

		  	//event handler for showing the stream of video
			peer.on('stream', function (stream) {
			    let video = document.createElement('video')
				let elem=document.getElementById("chatBox");

			    elem.insertBefore(video,elem.firstChild)
			    video.srcObject = stream
			    video.play()
			  	self.setState({show:false})
		  	})
		})
		.catch(function(err){
			alert("Sorry permission not given againn make a call!!!")
			window.location.reload()
		})
	}

	//when the user end the calls
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
		   	<SweetAlert
          		show={this.state.show}
          		title="Establishing Connection"
          		text="Please wait we are just connecting your call. The box will automatically disappear after successful connection."
          		onConfirm={() => console.log("OK")}
        	/>
			<div className="container">
				<div className="row">
			  		<div className="col-xs-6 col-md-6">
					    <pre id="messages"></pre>		
			    		<label>Enter Message:</label><br/>
					    <textarea id="yourMessage" style={{width:"100%"}}></textarea>
					    <button className="btn btn-primary" id="send">send</button>
					 </div>
			  		<div className="col-xs-6 col-md-6" id="chatBox">
					</div>
			    </div>
			</div>
			<center>
				<button className="btn btn-danger" onClick={()=>this.callDisconnect()}>End Call</button>
			</center>
		</div>
    );
  }
}

export default Video;
	
