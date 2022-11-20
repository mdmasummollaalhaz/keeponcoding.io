import React, { useState } from "react"
import { loginUser } from "../httpClient"
import { faGoogle, faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Form, Button } from 'react-bootstrap'


const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const baseUrl = process.env.REACT_APP_HTTP_BASE_URL

  const logInUser = async () => {
    try {
      const resp = await loginUser({email, password})
      window.location.reload()

    } catch (error: any) {
      if (error.response.status === 401) {
        alert("Invalid credentials")
      }
    }
  }

  return (
    <div className="login-component">
        {/* <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control type="text" value={email} placeholder="Enter Email" onChange={(e) => setEmail(e.target.value)}/>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
          </Form.Group>

          <Button variant="primary" type="button" onClick={() => logInUser()}>
            Submit
          </Button>   
        </Form>
        <br/> */}
        <a href={`${baseUrl}/api/google/login?currentpath=${encodeURIComponent(window.location.pathname)}`} className="btn btn-social btn-google"><i className="fa fa-google"></i><FontAwesomeIcon className="fa" icon={faGoogle}/> Sign in with Google</a>
        <a href={`${baseUrl}/api/github/login?currentpath=${encodeURIComponent(window.location.pathname)}`} className="btn btn-social btn-github"><i className="fa fa-google"></i><FontAwesomeIcon className="fa" icon={faGithub}/> Sign in with Github</a>
        <a href={`${baseUrl}/api/linkedin/login?currentpath=${encodeURIComponent(window.location.pathname)}`} className="btn btn-social btn-linkedin"><i className="fa fa-google"></i><FontAwesomeIcon className="fa" icon={faLinkedin}/> Sign in with LinkedIn</a>
    </div>
  )
}

export default LoginForm