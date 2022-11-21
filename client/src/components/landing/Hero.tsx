import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../../css/Hero.scss";
import heroImg from "../../media/img/header-img/hero.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';


const Hero: React.FC = ({}) => {

    return (
        <div className="hero">
            <Container>
                <Row className="heroRow mx-auto text-center">
                    {/* <Col>
                        <img src={heroImg} alt="Travel" className="w-100" />
                    </Col> */}
                    <Col>
                        <h1 className="hero-title">A New Way to Learn</h1>
                        <p className="paragraph">KeepOnCoding is the best platform to help you enhance your skills, expand your knowledge and prepare for technical interviews.</p>
                        <button>Create Account <FontAwesomeIcon className="icons" icon={ faAngleRight }/> </button>
                        
                    </Col>
                </Row>
            </Container>
        </div>
        
    )

}

export default Hero