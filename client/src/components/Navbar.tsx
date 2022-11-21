import React, { useState } from "react"
import Container from 'react-bootstrap/Container'
import "../css/Navbar.scss"
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import {NavLink, Outlet, useNavigate} from "react-router-dom"
import { logoutUser } from '../httpClient'
import { User } from '../types'
import Modal from 'react-bootstrap/Modal'
import LoginForm from '../components/LoginForm'

// Images
import logo from '../../src/media/img/logo/logo.jpg'

type NavBarProps = {
  _user: User
}

const NavBar: React.FC<NavBarProps> = (user: NavBarProps) => {
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleClose = () => setShowLoginModal(false)
  const handleShow = () => setShowLoginModal(true)

  const logout = async () => {
    try{
      await logoutUser()
      window.location.reload()
    } catch (error: any){
      console.log(error)
    }
  }

  return (
      <>
        <Navbar expand="lg" style={{backgroundColor: "#FFFFFF"}}>
          <Container>
          <Navbar.Brand style={{color: '#000'}} className="site-title" as={NavLink} to="/"><img src={logo} alt="" className='logo' /></Navbar.Brand>
          <Navbar.Brand style={{color: '#000'}} className="site-title" as={NavLink} to="/">keep on coding</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto navMenu">
              { user._user && user._user?.id !== "" ?
                (<>
                  <Nav.Link style={{color: '#000'}} as={NavLink} to="/getstart">Get Started</Nav.Link>
                  <Nav.Link style={{color: '#000'}} as={NavLink} to="/topics">Topics</Nav.Link>
                  {/* <Nav.Link style={{color: '#fff'}} as={NavLink} to="/leaderboards">Leaderboards</Nav.Link>
                  <Nav.Link style={{color: '#fff'}} as={NavLink} to="/rewards">Rewards</Nav.Link>
                  <Nav.Link style={{color: '#fff'}} onClick={logout}>Logout</Nav.Link> */}
                  </>
                ) : (
                  <>
                  <Nav.Link style={{color: '#000'}} onClick={handleShow}>Get Started</Nav.Link>
                  {/* <Nav.Link style={{color: '#000'}} as={NavLink} to="/getstart">Get Started</Nav.Link> */}
                  <Nav.Link style={{color: '#000'}} as={NavLink} to="/topics">Topics</Nav.Link>
                  {/* <Nav.Link style={{color: '#fff'}} as={NavLink} to="/leaderboards">Leaderboards</Nav.Link>
                  <Nav.Link style={{color: '#fff'}} as={NavLink} to="/rewards">Rewards</Nav.Link> */}
                  </>
                )
              }

            </Nav>
          </Navbar.Collapse>

          <Modal  show={showLoginModal} 
                  onHide={handleClose}
                  centered
                  >
            <Modal.Body><LoginForm/></Modal.Body>
          </Modal>
              
          </Container>
        </Navbar>
        <Outlet/>
      </>
  )

}
export default NavBar