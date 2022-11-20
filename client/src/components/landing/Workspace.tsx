import { Container, Row, Col } from "react-bootstrap";
import "../../css/Hero.scss";
import heroImg from "../../media/img/work/work.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

const Workspace: React.FC =()=>{
    return (
        <div className="hero">
            <Container>
                <Row>
                    <Col>
                        <h1 className="hero-title">The Perfect Practice Environment.</h1>
                        <p>In an ideal world, you'd prepare for coding interviews by writing out solutions to problems in your language of choice, getting some hints if necessary, running your code against test cases, and looking at solutions when done.</p>
                        <p>We've turned that ideal world into the real world. Pick a language. Read the prompt. Write your solution. Run your code. Get some hints. Run your code again. Check the output. Pass the tests. View our solution. Watch our video. All within the same workspace.</p>
                        <button>Try Our Workspace </button>
                    </Col>
                    <Col>
                        <img src={heroImg} alt="Travel" className="w-100" />
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Workspace 