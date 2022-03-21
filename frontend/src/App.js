import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from "./pages/HomePage";
import galleries from "./pages/galleries";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
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
            <Route exact path="/galleries" component={galleries} />
            {/* <Route exact path="/userprofile" component={Userprofile} /> */}
            <Route exact path="/MockCanvas" component={canvas} />
          </Switch>
        </div>
      </Router>
    </>
  );
}

export default App;
