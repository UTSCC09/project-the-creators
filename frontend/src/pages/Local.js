import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Container } from "react-bootstrap";
const Local = () => {
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
            <Button variant="primary">View</Button>
            <Button variant="primary">Edit</Button>
          </Container>
        </Card.Body>
      </Card>
    </>
  );
};

export default Local;
