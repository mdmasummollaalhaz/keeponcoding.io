import React, { useState, useEffect } from "react"
import {getTopics} from "../httpClient"
import {Link} from "react-router-dom"
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'

const TopicsPage: React.FC = () => {

  const [topics, setTopics] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {

    getTopics()
      .then(resp => {
        setTopics(resp.data)
        setIsLoading(false)
      })

  }, [])

  return (
    <div>
      { isLoading? (
        <>
          <Spinner animation="grow" role="status"/>
          <Spinner animation="grow" role="status"/>
          <Spinner animation="grow" role="status"/>
        </>
      ) : (
        <Container>
        { topics.map((topic, index) => {
          return      <Card 
                        key={index}
                        bg="dark"
                        border="primary" 
                        style={{ width: '18rem', margin: '.5rem' }}
                        className="topic-card"
                      >
                        <Link to={"/topics/" + topic['topic_url_path']} key={index} className="topic-card-link">
                        <Card.Body>
                          <Card.Title>{topic['question_topic_desc']}</Card.Title>
                        </Card.Body>
                        </Link>
                      </Card>
        })}
        </Container>
        )}
    </div>
  )
}

export default TopicsPage