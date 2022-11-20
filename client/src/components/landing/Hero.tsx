import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../../css/Hero.scss";
import heroImg from "../../media/img/header-img/hero.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';


const Hero: React.FC = ({}) => {

    return (
        <div className="hero">
            <Container>
                <Row className="heroRow">
                    <Col>
                        <img src={heroImg} alt="Travel" className="w-100" />
                    </Col>
                    <Col>
                        <h1 className="hero-title">A New Way to Learn</h1>
                        <p>LeetCode is the best platform to help you enhance your skills, expand your knowledge and prepare for technical interviews.</p>
                        <button>Create Account <FontAwesomeIcon icon={ faArrowRight }/> </button>
                        
                    </Col>
                </Row>
            </Container>
        </div>
        
    )

}

export default Hero