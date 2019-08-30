class Auth {
    constructor() {
      this.authenticated = false;
    }
  
    login(cb,token) {
      console.log(token)
      window.localStorage.setItem("isLoggedIn",true);
      window.localStorage.setItem("token",token);
      this.authenticated = true;
      cb();
    }
  
    logout(cb) {
      window.localStorage.setItem("isLoggedIn",false);
      window.localStorage.setItem("token",null);
      this.authenticated = false;
      cb();
    }
  
    isAuthenticated() {
  
      if(!window.localStorage.getItem("isLoggedIn"))
        return false;
      
      if(window.localStorage.getItem("isLoggedIn")=="false")
        return false;
      else
        return true;
    }
    getToken(){
      return window.localStorage.getItem("token");
    }
  }
  
  export default new Auth();