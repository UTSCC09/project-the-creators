import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Galleries from "./pages/Galleries";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Userprofile from "./pages/UserProfile";
import canvas from "./components/Canvas";

function App() {
  return (
    <>
      <Router>
        <div>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/signin" component={Signin} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/galleries" component={Galleries} />
            <Route exact path="/markotto" component={Userprofile} />
            <Route exact path="/MockCanvas" component={canvas} />
          </Switch>
        </div>
      </Router>
    </>
  );
}

export default App;
