import React, { Component } from "react";
import "./log.css";
import axios from 'axios';
import urlFor from './../../helpers/urlFor';
import Flash from './../../lib/Flash';
import './../home/index.css'
import auth from "./../../authguard/auth";

class login extends Component {
	constructor(props) {
		super(props);
		if(auth.isAuthenticated()){
			this.props.history.push("/home")
		}
		this.state = {
						username: '',
						password:'',
						confirm_pwd:'',
						name:'',
						usernameLogin:'',
						passwordLogin:'',
						error:''
					};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
	}
	
	//Event Handler for managing registration
	handleSubmit(e) {
		e.preventDefault();
		// const pattern = /[a-zA-Z0-9]+[\.]?([a-zA-Z0-9]+)?[\@][a-z]{3,9}[\.][a-z]{2,5}/g;
	 	// const result = pattern.test(this.state.username);
		// if(result===false){
		//  this.setState({
		//    error:"Please ensure username is email.",
		//  })
		//  return;
		// } 
		axios
        .post(
          urlFor("Register/"),
           this.state,
        )
        .then(res => {
			alert('Successfully Logged in');
		})
		.catch(res=>{
			let errorMsg="";
			for(let r in res.response.data){for(let j in res.response.data[r]){errorMsg=errorMsg+res.response.data[r][j]+"\n"}}
			this.setState({ error:errorMsg });
		});		
	}
	
	//setting the value of user input	
	handleChange(event) {
		let obj={}
		obj[event.currentTarget.name]=event.currentTarget.value;
		this.setState(obj);
	}

	//event handler for the submission of the login form
	handleLoginSubmit(e) {
		e.preventDefault();
		axios
        .post(
          urlFor("Login/"),
           {"username":this.state.usernameLogin,"password":this.state.passwordLogin},
        )
        .then(res => {
			console.log(JSON.stringify(res))
        	window.localStorage.setItem("userLoggedInData",JSON.stringify(res))
			auth.login(() => {
				this.props.history.push("/home");
			  },res.data.token);
		})
		.catch(res=>{
			this.setState({ error:res.response.data.message });
		});		
	}

	//function that open registration form	
	openRegisterForm(event){
		document.getElementById("register-form").style.display="block";
		document.getElementById("login-form").style.display="none";
		document.getElementById("login-form-link").classList.remove('active');
		event.currentTarget.classList.add('active');
		event.preventDefault();
	}

	//function that open login form	
	openLoginForm(event){
		document.getElementById("register-form").style.display="none";
		document.getElementById("login-form").style.display="block"; 
		document.getElementById("register-form-link").classList.remove('active');
		event.currentTarget.classList.add('active');
		event.preventDefault();
	}


	resetError = () => {
		this.setState({ error: '' });
	  }
	
 	
	render() {
		const { error } = this.state;

	return (
      <div style={{marginTop:100}}>
	   {error && <Flash error={error} resetError={this.resetError} />}
       <div className="container">
    	<div className="row">
			<div className="col-md-6 col-md-offset-3">
				<div className="panel panel-login">
					<div className="panel-heading">
						<div className="row">
							<div className="col-xs-6">
								<a href="#" onClick={(e) => this.openLoginForm(e)} className="active" id="login-form-link">Login</a>
							</div>
							<div className="col-xs-6">
								<a href="#" onClick={(e) => this.openRegisterForm(e)} id="register-form-link">Register</a>
							</div>
						</div>
						<hr />
					</div>
					<div className="panel-body">
						<div className="row">
							<div className="col-lg-12">
								<form id="login-form" role="form" style={{"display": "block"}}>
									<div className="form-group">
										<input type="text" name="usernameLogin" id="usernameLogin" value={this.state.usernameLogin} placeholder="Email" className="form-control" ref="first" pattern="\d{10}" onChange={this.handleChange} />
									</div>
									<div className="form-group">
										<input type="password" name="passwordLogin" id="passwordLogin" value={this.state.passwordLogin} className="form-control" placeholder="Password" onChange={this.handleChange}/>
									</div>
									<div className="form-group">
										<div className="row">
											<div className="col-sm-6 col-sm-offset-3">
												<input type="submit" name="login-submit" id="login-submit" className="form-control btn btn-login" onChange={this.handleChange} value="Log In" onClick={this.handleLoginSubmit}/>
											</div>
										</div>
									</div>
								</form>
									
									
								<form id="register-form" style={{"display": "none"}}>
									<div className="form-group" onSubmit={this.handleSubmit}>
										<input type="text" name="username" id="usernname" value={this.state.username} className="form-control" placeholder="Email" ref="first"  onChange={this.handleChange}/>
									</div>
									<div className="form-group">
										<input type="text" name="name" value={this.state.name} id="name" className="form-control" placeholder="Name" ref="second" onChange={this.handleChange}/>
									</div>
									<div className="form-group">
										<input type="password" name="password" id="password" value={this.state.password} className="form-control" placeholder="Password" onChange={this.handleChange}/>
									</div>
									<div className="form-group">
										<input type="password" name="confirm_pwd" id="confirm_pwd" value={this.state.confirm_pwd} className="form-control" placeholder="Confirm Password" onChange={this.handleChange}/>
									</div>
									<div className="form-group">
										<div className="row">
											<div className="col-sm-6 col-sm-offset-3">
												<input type="submit" name="register-submit" id="register-submit" className="form-control btn btn-register" value="Register Now" onClick={this.handleSubmit} onChange={this.handleChange}/>
											</div>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

    </div>
    );
  }
}

export default login;

