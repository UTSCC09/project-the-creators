import React, { useState, useEffect, useRef } from "react";
import { Container, Form, Button } from "react-bootstrap";
import "./Chat.css";

export default function Chat() {
  const [curmsg, setcurmsg] = useState("");

  const resetinput = () => {
    document.querySelector(".inputfield").reset();
  };

  return (
    <>
      <Container className="chatbox">
        <div className="messages">
          <div className="message">
            <div>123</div>
            <div></div>
          </div>
          <div className="message">321</div>
          <div className="message">{curmsg}</div>
        </div>
        <Form className="inputfield">
          <Form.Control
            //value={curmsg}
            as="textarea"
            //onChange={(e) => setcurmsg(e.target.value)}
            type="input"
            onKeyPress={(e) => {
              if (e.key === "Enter" && e.shiftKey == false) {
                setcurmsg(e.target.value);
                resetinput();
              }
            }}
          />
        </Form>
      </Container>
    </>
  );
}
