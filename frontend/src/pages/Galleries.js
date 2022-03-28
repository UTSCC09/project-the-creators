import Header from "../components/Header";
import Nav from "react-bootstrap/Nav";
import { Tab, Tabs } from "react-bootstrap";
import { Container } from "react-bootstrap";
import Local from "./Local";
import Shared from "./Shared";

const Galleries = () => {
  return (
    <>
      <Header />
      <Container className="pt-5 pb-3">
        <Tabs defaultActiveKey="shared" id="accountPG" className="">
          <Tab eventKey="shared" title="Shared">
            <Shared />
          </Tab>
          <Tab eventKey="local" title="Local"></Tab>
            <Local />
        </Tabs>
      </Container>
    </>
  );
};

export default Galleries;
