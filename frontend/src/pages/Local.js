import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Container } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";

const Local = ({ data }) => {
  const [projects, setprojects] = useState({
    data: null,
    error: false,
  });
  const getUserLocal = () => {
    axios
      .get(`/local/${data.uid}`)
      .then((res) => {
        setprojects({
          data: res.data,
          error: false,
        });
      })
      .catch(() => setprojects({ error: true }));
  };
  const removeLocal = (id) => {
    axios
      .delete(`/local/${id}`)
      .then(() => {
        window.location = "/galleries";
      })
      .catch((error) => {
        console.error(error);
      });
  };

  /* useEffect(() => {
    getUserLocal();
  }, [data.uid]); 

  if (data.uid === null) {
    return <p>Loading</p>;
  }
  if (projects.data === null) {
    return <p>Loading</p>;
  } */
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
