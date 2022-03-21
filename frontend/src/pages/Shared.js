import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import canvas from "../components/Canvas";

const Shared = () => {
  return (
    <>
      <Card style={{ width: "18rem", marginTop: "10px" }}>
        <Card.Img variant="top" src="test" />
        <Card.Body>
          <Card.Title>Test</Card.Title>
          <Card.Text>Test</Card.Text>
          <Container
            style={{ display: "flex", justifyContent: "space-around" }}
          >
            <Button
              variant="primary"
              onClick={() => {
                window.location.href = `/MockCanvas`;
              }}
            >
              View
            </Button>
            <Button variant="primary">Edit</Button>
          </Container>
        </Card.Body>
      </Card>
    </>
  );
};

export default Shared;
