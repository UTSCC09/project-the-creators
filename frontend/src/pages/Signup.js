import React, { useState } from "react";
import Header from "../components/Header";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import "./Signup.css";
import axios from "axios";
import { useForm } from "react-hook-form";
import { authUrl, apiUrl } from "../lib/constants.js"
const SignupPage = () => {
  // States
  /* const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    fname: "",
    lname: "",
    city: "",
    phone: "",
  }); */
  const [hasError, setHasError] = useState({
    duplicate: false,
    missInfo: false,
    internal: false,
  });
  const [succ, setSucc] = useState(false);
  /* const submitHandler = (e) => {
    e.preventDefault();
  }; */

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const SignUp = async (data) => {
    console.log(data);
    await axios
      .post(authUrl + "/signup", {
        username: data.username,
        email: data.email,
        password: data.password,
        fname: data.fname,
        lname: data.lname,
        city: data.city,
        phone_number: data.phone,
      })
      .then(() => {
        setHasError({ missInfo: false });
        setSucc(true);
        window.location = "/signin";
      })
      .catch((err) => {
        if (err.response.status === 400) {
          setHasError({ missInfo: true });
        } else if (err.response.status === 401) {
          setHasError({ duplicate: true });
        } else {
          setHasError({ internal: true });
        }
      });
  };

  return (
    <>
      <Header />
      <div className="pageform">
        <Row>
          <Col>
            <h2 className="mb-4 mt-3">Create An Account</h2>
          </Col>
        </Row>
        <Form onSubmit={handleSubmit(SignUp)}>
          <Form.Group className="mb-3">
            <Form.Label>Username *</Form.Label>
            <Form.Control
              placeholder="Enter username"
              {...register("username")}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password *</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              {...register("password")}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email address *</Form.Label>
            <Form.Control
              placeholder="Enter email"
              {...register("email", {
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                  message: "This is not a valid email",
                },
              })}
            />
            {errors.email && (
              <Alert variant="warning">{errors.email.message}</Alert>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone number *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Phone number"
              {...register("phone", {
                pattern: {
                  value: /^[0-9]*$/,
                  message: "Numbers only",
                },
                /* minLength: {
                  value: 10,
                  message: "Not a 10 digits phone number",
                },
                maxLength: {
                  value: 10,
                  message: "Not a 10 digits phone number",
                }, */
              })}
            />
            {errors.phone && (
              <Alert variant="warning">{errors.phone.message}</Alert>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>First Name *</Form.Label>
            <Form.Control
              type="text"
              placeholder="First Name"
              {...register("fname")}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Last Name *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Last Name"
              {...register("lname")}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>City *</Form.Label>
            <Form.Control
              type="text"
              placeholder="City"
              {...register("city")}
            />
          </Form.Group>

          {hasError.missInfo && (
            <div className="alert alert-warning mb-3 mid" role="alert">
              Please enter all required information.
            </div>
          )}
          {hasError.duplicate && (
            <div className="alert alert-warning mb-3 mid" role="alert">
              This user has already been registered, please sign up with a
              different username.
            </div>
          )}
          {hasError.internal && (
            <div className="alert alert-danger mb-3 mid" role="alert">
              There is an internal error with Sign up, please try again later.
            </div>
          )}
          <div className="mid">
            <Button
              className="mb-3 btn btn-dark bigger"
              variant="primary"
              type="submit"
            >
              Sign Up
            </Button>
          </div>
          {succ && (
            <div className="alert alert-success mb-3 mid mt-3" role="alert">
              Signup Success!
            </div>
          )}
        </Form>
      </div>
    </>
  );
};

export default SignupPage;
