import { Navbar, Nav, Container } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { authUrl, apiUrl } from "../lib/constants.js";

const Header = () => {
  const [status, setStatus] = useState({ isLoggedIn: false, user: null });
  const signout = async () => {
    await axios
      .get(authUrl + "/signout", { withCredentials: true })
      .then(() => {
        setStatus({ isLoggedIn: false, user: null });
        window.location = "/";
      });
  };

  useEffect(() => {
    const user = document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")
    if (user !== "") {
      //console.log("here");
      setStatus({ isLoggedIn: true, user: user });
      //console.log(status);
    } else {
      setStatus({ isLoggedIn: false, user: null });
    }

  }, []);

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">Envisionit</Navbar.Brand>
          <Nav className="me-auto">
            {status.isLoggedIn && (
              <Nav.Link href="/galleries">Galleries</Nav.Link>
            )}
          </Nav>

          <Navbar.Collapse className="justify-content-end">
            {status.isLoggedIn && (
              <Navbar.Text>
                Signed in as: <a href="/userprofile">{status.user}</a>
              </Navbar.Text>
            )}
            <Nav>
              {status.isLoggedIn && (
                <Nav.Link href="/userprofile">Profile</Nav.Link>
              )}
            </Nav>
            {status.isLoggedIn && (
              <Nav.Link onClick={signout}>Sign out</Nav.Link>
            )}
            <Nav>
              {!status.isLoggedIn && (
                <Nav.Link href="/signin">Sign in/up</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
