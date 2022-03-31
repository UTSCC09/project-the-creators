import Header from "../components/Header";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { authUrl, apiUrl } from "../lib/constants.js"
import axios from "axios";

const Sign = () => {
  const [details, setDetails] = useState({ name: "", password: "" });
  const [hasError, setHasError] = useState(false);
  const [pass, setPass] = useState(false);

  useEffect(() => {
    pass && (window.location = "/");
  }, [pass]);

  const checkLogin = async () => {
    setHasError(false);
    await axios
      .post(authUrl + "/signin", {
        username: details.name,
        password: details.password,
      })
      .then(() => {
        setPass(true);
      })
      .catch(() => {
        setHasError(true);
      });
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <Header />
      <div
        className="bg-white"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "100px",
        }}
      >
        <div>
          <Container
            fluid
            style={{
              border: "2px #3C3D3F solid",
              borderRadius: "10px",
              paddingTop: "12px",
              paddingBottom: "12px",
            }}
          >
            <Form onSubmit={submitHandler}>
              <Row md>
                <Col>
                  <Form.Group
                    className="mb-3 form-signin"
                    controlId="formEmail"
                  >
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Username"
                      onChange={(e) =>
                        setDetails(
                          { ...details, name: e.target.value },
                          setHasError(false)
                        )
                      }
                      value={details.name}
                    />
                  </Form.Group>
                </Col>
                <Form.Group
                  className="mb-3 form-signin"
                  controlId="formPassword"
                >
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter Password"
                    onChange={(e) =>
                      setDetails(
                        { ...details, password: e.target.value },
                        setHasError(false)
                      )
                    }
                    value={details.password}
                  />
                </Form.Group>
              </Row>
              <Row>
                <Col>
                  {hasError && (
                    <div
                      className="alert alert-warning mid full-width"
                      role="alert"
                    >
                      Wrong Login info. Please try again.
                    </div>
                  )}
                  <Button
                    className="mb-2"
                    variant="primary"
                    type="submit"
                    size="lg"
                    style={{ width: "100%" }}
                    onClick={checkLogin}
                  >
                    Login
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Text className="text-black form-control-md-8">
                    Don't have an account yet? Sign up!
                  </Form.Text>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    className="mb-2"
                    variant="dark"
                    type="submit"
                    size="lg"
                    style={{ width: "100%" }}
                    onClick={() => {
                      window.location.href = `/signup`;
                    }}
                  >
                    Sign up
                  </Button>
                </Col>
              </Row>
            </Form>
          </Container>
        </div>
      </div>
    </>
  );
};

export default Sign;
