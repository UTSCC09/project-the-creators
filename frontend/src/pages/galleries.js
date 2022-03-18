import Header from "../components/Header";
import Nav from "react-bootstrap/Nav";
import { Tab, Tabs } from "react-bootstrap";
import { Container } from "react-bootstrap";
import Local from "./Local";

const galleries = () => {
  return (
    <>
      <Header />
      <Container className="pt-5 pb-3">
        <Tabs defaultActiveKey="local" id="accountPG" className="">
          <Tab eventKey="local" title="Local">
            <Local />
          </Tab>
          <Tab eventKey="shared" title="Shared"></Tab>
        </Tabs>
      </Container>
    </>
  );
};

export default galleries;
