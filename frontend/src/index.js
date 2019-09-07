import React from "react";
import ReactDOM from "react-dom";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { ProtectedRoute } from "./authguard/protected.route";
import home from "./components/home";
import login from "./components/login/login"
import video from "./components/video/video"

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={login} />
        <ProtectedRoute  path="/home" component={home} />
        <ProtectedRoute  path="/video" component={video} />
        <Route path="*" component={() => "404 NOT FOUND"} />
      </Switch>
    </div>
  );
}
const rootElement = document.getElementById("root");
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  rootElement
);

serviceWorker.unregister();
