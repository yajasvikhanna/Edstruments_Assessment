import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styled from "styled-components";

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: radial-gradient(
      circle at 30% 30%,
      rgba(57, 255, 20, 0.15),
      transparent 30%
    ),
    radial-gradient(circle at 80% 80%, rgba(57, 255, 20, 0.15), transparent 40%),
    linear-gradient(135deg, #1a1a1a, #0d0d0d); /* Smooth slate black base */
  background-color: #0d0d0d;
  color: white;
`;

const LoginBox = styled.div`
  background-color: rgba(0, 0, 0, 0.8); /* Semi-transparent black background */
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  padding: 40px;
  width: 100%;
  max-width: 400px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px); /* Adds a blur effect behind the box */
  &:hover {
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
  }
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 30px;
  color: #fff; /* White text for title in dark mode */
  font-size: 28px;
  font-family: "Arial", sans-serif;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #dfe6e9; /* Light grey text for labels */
  font-size: 14px;
`;

const Input = styled(Field)`
  width: 100%;
  padding: 12px;
  border: 1px solid #b2bec3; /* Light grey border for dark mode */
  border-radius: 8px;
  font-size: 16px;
  color: #dfe6e9; /* Light text color */
  background-color: #2c3e50; /* Dark background for inputs */
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #39ff14; /* Neon bright green border */
    box-shadow: 0 0 5px rgba(57, 255, 20, 0.2);
  }

  &::placeholder {
    color: #b2bec3; /* Lighter placeholder text */
  }
`;

const ErrorText = styled.div`
  color: #e74c3c; /* Red color for error messages */
  font-size: 14px;
  margin-top: 5px;
  font-weight: 500;
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #39ff14; /* Bright neon green button */
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #32cd32; /* Slightly lighter neon green on hover */
    transform: scale(1.05);
  }

  &:active {
    background-color: #2e8b57; /* Darker green when clicked */
  }
`;

const Signature = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-family: "Courier New", Courier, monospace;
  font-size: 14px;
  color: rgba(57, 255, 20, 0.75); /* Neon green color */
  text-shadow: 0 0 5px rgba(57, 255, 20, 0.75), 0 0 10px rgba(57, 255, 20, 0.75),
    0 0 20px rgba(57, 255, 20, 0.75); /* Neon glow effect */
`;

const validationSchema = Yup.object({
  username: Yup.string()
    .required("Username is required")
    .matches(
      /^(?=.*[A-Za-z])[A-Za-z0-9]+$/,
      "Username must contain at least one letter and cannot be only numbers or special symbols"
    ),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long"), // Optional: enforce password length
});

function LoginPage({ setIsLoggedIn }) {
  const handleSubmit = (values) => {
    // Simulating login, you can replace this logic with an actual API call
    localStorage.setItem(
      "userData",
      JSON.stringify({
        username: values.username,
        loggedInAt: new Date().toISOString(),
      })
    );
    setIsLoggedIn(true);
  };

  return (
    <LoginContainer>
      <LoginBox>
        <Title>Invoice App Login</Title>
        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormGroup>
                <Label htmlFor="username">Username</Label>
                <Input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                />
                <ErrorMessage name="username" component={ErrorText} />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                />
                <ErrorMessage name="password" component={ErrorText} />
              </FormGroup>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </Form>
          )}
        </Formik>
      </LoginBox>
      <Signature>Created by Yajasvi Khanna</Signature> {/* Signature here */}
    </LoginContainer>
  );
}

export default LoginPage;
