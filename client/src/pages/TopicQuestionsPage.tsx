import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useParams } from "react-router-dom"
import Table from 'react-bootstrap/Table'
import Container from 'react-bootstrap/Container'
import { getTopicQuestions } from "../httpClient"
import Spinner from 'react-bootstrap/Spinner'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const TopicQuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  let {topicUrlPath} = useParams()

  useEffect(() => {

    getTopicQuestions({topicUrlPath}.topicUrlPath)
      .then(resp => {
        setQuestions(resp.data)
        setIsLoading(false)
      })

  }, [])

  return (
    <>
      { isLoading ? (
          <>
          <Spinner animation="grow" role="status"/>
          <Spinner animation="grow" role="status"/>
          <Spinner animation="grow" role="status"/>
        </>
      ) : (
      <Container>
        <Table hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Completed</th>
              <th>Question</th>
              <th>Difficulty</th>
            </tr>
          </thead>
          <tbody>
            { questions.map((topic, index) => {
              return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td></td>
                    <td><Link to={'/questions/' + topic['question_name']}>{topic['title']}</Link></td>
                    <td>{topic['question_difficulty_desc']}</td>
                  </tr>
                )
            })}
          </tbody>
        </Table>
      </Container>
      )}
    </>
  )
}

export default TopicQuestionsPage