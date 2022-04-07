import Header from "../components/Header";
import Nav from "react-bootstrap/Nav";
import { Tab, Tabs, Button } from "react-bootstrap";
import { Container } from "react-bootstrap";
import Local from "./Local";
import Shared from "./Shared";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { authUrl, apiUrl } from "../lib/constants.js";

const Galleries = () => {
  const [status, setStatus] = useState({ isLoggedIn: false, user: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/auth/user")
      .then((res) => {
        setStatus(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    axios
      .get(authUrl + "/currentUser", { withCredentials: true })
      .then((res) => {
        if (res.data !== "") {
          setStatus({ isLoggedIn: true, user: res.data });
        } else {
          setStatus({ isLoggedIn: false, user: null });
        }
      });
  }, []);

  const newproject = async () => {
    console.log(status);
    await axios
      .post(
        apiUrl + "/canvas",
        { username: status.user },
        { withCredentials: true }
      )
      .then(() => {
        window.location.href = `/MockCanvas`;
      });
  };

  return (
    <>
      <Header />
      <div></div>
      <Container className="pt-5 pb-3">
        <Button className="mb-3" variant="primary" onClick={newproject}>
          Start a new project
        </Button>
        <Tabs defaultActiveKey="shared" id="accountPG" className="">
          <Tab eventKey="shared" title="Shared">
            <Shared data={status.user} />
          </Tab>
          <Tab eventKey="local" title="Local">
            <Local data={status.user} />
          </Tab>
        </Tabs>
      </Container>
    </>
  );
};

export default Galleries;
