import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Container, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import canvas from "../components/Canvas";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { authUrl, apiUrl } from "../lib/constants.js";

const Shared = ({ data }) => {
  const [projects, setprojects] = useState({
    data: null,
    error: false,
  });

  useEffect(() => {
    //console.log(data);
    axios
      .get(apiUrl + `/gallery/${data}/null`, { withCredentials: true })
      .then((res) => {
        setprojects({
          data: res.data,
          error: false,
        });
        //console.log(data);
        //console.log(projects.data);
      })
      .catch(() => setprojects({ error: true }));
  }, []);

  /* useEffect(() => {
    window.location = "/galleries";
  }, [projects]); */

  const removeShared = (id) => {
    axios
      .delete(`/shared/${id}`)
      .then(() => {
        window.location = "/galleries";
      })
      .catch((error) => {
        console.error(error);
      });
  };

  /* useEffect(() => {
    getUserShared();
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

export default Shared;
