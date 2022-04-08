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

  return (
    <>
      <Header />
      <div></div>
      <Container className="pt-5 pb-3">
        <Tabs defaultActiveKey="shared" id="accountPG" className="">
          <Tab eventKey="shared" title="Shared">
            <Shared />
          </Tab>
          <Tab eventKey="local" title="Local">
            <Local />
          </Tab>
        </Tabs>
      </Container>
    </>
  );
};

export default Galleries;
