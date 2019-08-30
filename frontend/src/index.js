import React from "react";
import ReactDOM from "react-dom";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { ProtectedRoute } from "./authguard/protected.route";
import home from "./components/home";
import login from "./components/login/login"

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={login} />
        <ProtectedRoute  path="/home" component={home} />
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
