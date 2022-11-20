import React from "react"
import Container from 'react-bootstrap/Container'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPython, faJava, faJs } from "@fortawesome/free-brands-svg-icons"

const LeaderboardsPage: React.FC = () => {
  return (
    <div>
      <Container>
        <div className="language-icons d-flex justify-content-evenly">
          <FontAwesomeIcon icon={faPython}/>
          <FontAwesomeIcon icon={faJs}/>
          <FontAwesomeIcon icon={faJava}/>
        </div>
      </Container>
    </div>
  )
}

export default LeaderboardsPage