import React, { useState } from "react"
import httpClient from "../httpClient"
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useNavigate } from "react-router-dom"
import Container from 'react-bootstrap/Container';
import { FormGroup } from "react-bootstrap"

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState<string>("")
  const [userName, setUserName] = useState<string>("")
  const [password1, setPassword1] = useState<string>("")
  const [password2, setPassword2] = useState<string>("")

  const registerUser = async () => {
    try {
      const resp = await httpClient.post("http://localhost:5001/api/register", {
        email,
        userName,
        password1,
        password2
      })

      window.location.href = "/topics"
    } catch (error: any) {
      if (error.response.status === 401) {
        alert("Invalid credentials")
      }
    }
  }

  return (
    <>
    <Container>
        <Form className="register-component">
          <Form.Group controlId="formBasicEmail">
            <Form.Control className="register-form-control" type="text" value={email} placeholder="E-mail address" onChange={(e) => setEmail(e.target.value)}/>
            <Form.Control className="register-form-control" type="text" value={userName} placeholder="Username" onChange={(e) => setUserName(e.target.value)}/>
          </Form.Group>
          
          <Form.Group controlId="formBasicPassword">
            <Form.Control className="register-form-control" type="password" value={password1} placeholder="Password" onChange={(e) => setPassword1(e.target.value)}/>
            <Form.Control className="register-form-control" type="password" value={password2} placeholder="Confirm Password" onChange={(e) => setPassword2(e.target.value)}/>
          </Form.Group>
          <Button variant="primary" type="button" onClick={() => registerUser()}>
            Sign Up
          </Button>
        </Form>
      </Container>
    </>
  )
}

export default RegisterPage