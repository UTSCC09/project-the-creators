import Header from "../components/Header";
import Nav from "react-bootstrap/Nav";
import { Tab, Tabs } from "react-bootstrap";
import { Container } from "react-bootstrap";
import Local from "./Local";
import Shared from "./Shared";
import React, { useState, useEffect } from "react";
import axios from "axios";

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

  return (
    <>
      <Header />
      <Container className="pt-5 pb-3">
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
