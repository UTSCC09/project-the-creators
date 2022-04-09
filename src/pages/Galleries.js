import Header from "../components/Header";
import Nav from "react-bootstrap/Nav";
import { Tab, Tabs, Button, Alert } from "react-bootstrap";
import { Container } from "react-bootstrap";
import Local from "./Local";
import Shared from "./Shared";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Galleries = () => {

  const history = useHistory();

  const currentUser = document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")

  const submitURL = async () => {
    var inputVal = document.getElementById("canvas-url").value;
    if(inputVal){

      const data = await axios.put(inputVal, {
      },
      { withCredentials: true },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        if(response.status == 200){
          history.push("/canvas", {identifier: response.data});
        }
      });
    }
  }

  return (
    <>
        <Header />
      {currentUser ? (
      <Container className="pt-5 pb-3">
        <Tabs defaultActiveKey="shared" id="accountPG" className="">
          <Tab eventKey="shared" title="Shared">
            <input type="text" id="canvas-url" placeholder="Enter a shared canvas URL"></input>
            <button id="canvas-url-submit" onClick={submitURL}>SUBMIT</button>
            <Shared />
          </Tab>
          <Tab eventKey="local" title="Local">
            <Local />
          </Tab>
        </Tabs>
      </Container>
      ) : (
        <Alert variant="warning" onClick={()=>{window.location = "/signin"}} style={{ position: "fixed", left: "45%", top: "30%"}}>Please log in first</Alert>
      )}
    </>
  );
};

export default Galleries;
