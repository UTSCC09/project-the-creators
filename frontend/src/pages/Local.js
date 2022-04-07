import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Container, Row } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { authUrl, apiUrl } from "../lib/constants.js";

const Local = ({ data }) => {
  const [projects, setprojects] = useState({
    data: null,
    error: false,
  });

  useEffect(() => {
    axios
      .get(apiUrl + `/gallery/${data}/null`, { withCredentials: true })
      .then((res) => {
        setprojects({
          data: res.data,
          error: false,
        });
      })
      .catch(() => setprojects({ error: true }));
  }, []);

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
      {projects.error && (
        <div className="alert alert-warning" role="alert">
          An error occured while fetching projects.
        </div>
      )}
      <Container>
        {projects.data ? (
          <div>
            <Row>
              {projects.data.map((project) => (
                <Card
                  key={project._id}
                  style={{
                    width: "18rem",
                    marginTop: "10px",
                    marginLeft: "10px",
                    marginRight: "10px",
                  }}
                >
                  <Card.Img variant="top" src="test" />
                  <Card.Body>
                    <Card.Title>{project.title}</Card.Title>
                    <Card.Text>{project.creator}</Card.Text>
                    <Container
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      <Button
                        variant="primary"
                        onClick={() => {
                          window.location.href = `/MockCanvas`;
                        }}
                      >
                        View
                      </Button>
                      <Button variant="danger">Remove</Button>
                    </Container>
                  </Card.Body>
                </Card>
              ))}
            </Row>
          </div>
        ) : (
          <div></div>
        )}
      </Container>
    </>
  );
};

export default Local;
