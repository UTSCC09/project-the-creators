import { Navbar, Nav, Container } from "react-bootstrap";
import React, { useState, useEffect } from "react";

const Header = () => {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">Envisionit</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/signin">Sign in/up</Nav.Link>
            <Nav.Link href="/galleries">Galleries</Nav.Link>
          </Nav>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              Signed in as: <a href="#login">Mark Otto</a>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
