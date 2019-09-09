class Auth {
    constructor() {
      this.authenticated = false;
    }
    
    //this function saves the loggedIn user token 
    login(cb,token) {
      window.localStorage.setItem("isLoggedIn",true);
      window.localStorage.setItem("token",token);
      this.authenticated = true;
      cb();
    }
    
    //this function delete the logged in token from localStorage
    logout(cb) {
      window.localStorage.setItem("isLoggedIn",false);
      window.localStorage.setItem("token",null);
      this.authenticated = false;
      cb();
    }
  
    //function checks whether the user is authenticated or not  
    isAuthenticated() {
  
      if(!window.localStorage.getItem("isLoggedIn"))
        return false;
      
      if(window.localStorage.getItem("isLoggedIn")=="false")
        return false;
      else
        return true;
    }

    //funtion return the token 
    getToken(){
      return window.localStorage.getItem("token");
    }
  }
  
  export default new Auth();