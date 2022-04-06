import { Navbar, Nav, Container } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";

const Header = () => {
  const [status, setStatus] = useState({ isLoggedIn: false, user: null });

  const signout = async () => {
    await axios.post("/auth/signout").then(() => {
      window.location = "/";
    });
  };

  /* useEffect(() => {
    axios.get("/auth/user").then((res) => setStatus(res.data));
  }, []); */

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">Envisionit</Navbar.Brand>
          <Nav className="me-auto">
            {status.isLoggedIn ? (
              <Nav.Link href="/">Sign out</Nav.Link>
            ) : (
              <Nav.Link href="/signin">Sign in/up</Nav.Link>
            )}
            <Nav.Link href="/galleries">Galleries</Nav.Link>
          </Nav>

          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              Signed in as: <a href="/markotto">Mark Otto</a>
            </Navbar.Text>
            <Nav.Link href="/">Sign out</Nav.Link>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
