import React, { useState, useEffect, useInsertionEffect } from "react"
import Button from 'react-bootstrap/Button'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Form from 'react-bootstrap/Form'
import { useParams } from "react-router-dom"
import Spinner from 'react-bootstrap/Spinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPython, faJava, faJs } from "@fortawesome/free-brands-svg-icons"
import { faVideo, faComments, faFileLines, faPager, faFlask, faSquarePollVertical, faTerminal } from "@fortawesome/free-solid-svg-icons"
import { QuestionType } from '../types'
import { getQuestion, submitCode, testCode } from "../httpClient"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import CodeMirror from '@uiw/react-codemirror'
import {sublime} from '@uiw/codemirror-theme-sublime'
import { python } from '@codemirror/lang-python'
import { javascript } from '@codemirror/lang-javascript'
import { java } from '@codemirror/lang-java'
import Accordion from 'react-bootstrap/Accordion'
import ListGroup from 'react-bootstrap/ListGroup'
import ReactPlayer from 'react-player/vimeo'
import { User } from '../types'
import Modal from 'react-bootstrap/Modal'
import LoginForm from '../components/LoginForm'

interface QuestionProps {
  _user: User
}

const QuestionPage: React.FC<QuestionProps> = (user: QuestionProps) => {

  const [question, setQuestion] = useState<QuestionType>({title : "", prompt: "", constraints: "", video_url: "", id: 0})
  const [questionExamples, setQuestionExamples] = useState([])
  const [questionSubmissions, setQuestionSubmissions] = useState([] as any[])

  const [codeTemplate, setCodeTemplate] = useState([])
  const [sampleTestCode, setSampleTestCode] = useState([])
  
  const [isLoading, setIsLoading] = useState(true)
  const [code, setCode] = useState("")

  const [pythonCode, setPythonCode] = useState("")
  const [javascriptCode, setJavascriptCode] = useState("")
  const [javaCode, setJavaCode] = useState("")

  const [pythonContentVisible, setPythonContentVisible] = useState(true)
  const [javascriptContentVisible, setJavascriptContentVisible] = useState(false)
  const [javaContentVisible, setJavaContentVisible] = useState(false)

  const [test, setTest] = useState("")
  const [pythonTestCode, setPythonTestCode] = useState("")
  const [javascriptTestCode, setJavascriptTestCode] = useState("")
  const [javaTestCode, setJavaTestCode] = useState("")

  const [testResults, setTestResults] = useState([])
  const [consoleOutput, setConsoleOutput] = useState([])
  const [languageSelect, setLanguageSelect] = useState("1")
  const [resultsTab, setResultsTab] = useState<any>("results")
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [videoUrl, setVidoeUrl] = useState("")

  let {questionName} = useParams()

  useEffect(() => {
    getQuestion({questionName}.questionName)
    .then(resp => {
      setQuestion(resp.data.question)
      setQuestionExamples(resp.data.question_examples)
      setQuestionSubmissions(resp.data.question_submissions)
      setCodeTemplate(resp.data.question_template)
      setSampleTestCode(resp.data.question_test_code)

      setPythonCode(resp.data.question_template[0]['boilerplate'])
      setJavascriptCode(resp.data.question_template[1]['boilerplate'])
      setJavaCode(resp.data.question_template[2]['boilerplate'])
      setPythonTestCode(resp.data.question_test_code[0]['test_code'])
      setJavascriptTestCode(resp.data.question_test_code[1]['test_code'])
      setJavaTestCode(resp.data.question_test_code[2]['test_code'])
      setIsLoading(false)
    })
  }, [])

    //Change based on select values
    useEffect(() => {
      languageSelect === "1" ? setPythonContentVisible(true) : setPythonContentVisible(false)
      languageSelect === "2" ? setJavascriptContentVisible(true) : setJavascriptContentVisible(false)
      languageSelect === "3" ? setJavaContentVisible(true) : setJavaContentVisible(false)
    }, [languageSelect])

  const handleSelectOnChange = (e: any) => {
    setLanguageSelect(e.target.value)
  }

  const test_code = async () => {
    try {
      if(user._user == null || user._user?.id == ""){
        handleShow()
      }else{
        setResultsTab("results")
        const resp = await testCode(code, parseInt(languageSelect), question['id'].toString(), test)
        var testOutput = resp.data['test_output']
        var testResultList = testOutput['test_result_list']
        setTestResults(testResultList)
        setConsoleOutput(resp.data['console_output'])
      }
    } catch (error: any) {
      console.log(error)
    }
  }

  const submit = async () => {

    try {
      if(user._user == null || user._user?.id == ""){
        handleShow()
      }else{
        setResultsTab("results")
        const resp = await submitCode(code, parseInt(languageSelect), question['id'].toString())
        var testOutput = resp.data['test_output']
        var testResultList = testOutput['test_result_list']
        setTestResults(testResultList)
        setConsoleOutput(resp.data['console_output'])
      }
    } catch (error: any) {
      console.log(error)
    }
  }

  const codeChange = (value: string, viewUpdate: any) => {
    setCode(value)
  }

  const testChange = (value: string, viewUpdate: any) => {
    setTest(value)
  }

  const handleClose = () => setShowLoginModal(false)
  const handleShow = () => setShowLoginModal(true)

  return (
    <> 
      { isLoading? (
        <>
          <Spinner animation="grow" role="status"/>
          <Spinner animation="grow" role="status"/>
          <Spinner animation="grow" role="status"/>
        </>
      ) : (
        <>
            <Row>
              <Col>
                <Tabs
                  defaultActiveKey="problem"
                  id="fill-tab-example"
                  justify
                  className="question-tabs"
                >
                  <Tab className="question-tab" eventKey="problem" title={<span><FontAwesomeIcon icon={faFileLines}/>{" Problem"}</span>}>
                    <h3>{question.title}</h3>
                    {question.prompt}<br/><br/>
                    <h5>Examples</h5>
                    { questionExamples.map((example, index) => {
                      return <div key={index}>{'Input: ' + example['input']}<br/>
                               {'Output: ' + example['output']}<br/>
                               {example['explanation'] ? 'Explanation: ' + example['explanation'] : ''}<br/><br/>
                              </div>
                    })}
                    
                    {question.constraints ? 'Constraints: ' + question.constraints : ''}
                    
                    <Accordion alwaysOpen>
                      <Accordion.Item eventKey="0">
                        <Accordion.Header>Hints</Accordion.Header>
                        <Accordion.Body>
                          Lorem ipsum dolor sit amet.
                        </Accordion.Body>
                      </Accordion.Item>
                      <Accordion.Item eventKey="1">
                        <Accordion.Header>Similar Questions</Accordion.Header>
                        <Accordion.Body>
                          Lorem ipsum dolor sit amet.
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>               
                    </Tab>

                  <Tab className="question-tab" eventKey="submissions" title={<span><FontAwesomeIcon icon={faPager}/>{" Submissions"}</span>}>
                    <ListGroup variant="flush">
                      { questionSubmissions.length == 0 ? 'No Submissions Yet.' : questionSubmissions.map((submission, index) => {
                          return <ListGroup.Item key={index}>
                          <div className={`${submission['submission_status'] == "1" ? "accepted-subission-status" : "rejected-submission-status"}`}>
                            {submission['status_desc']}
                          </div>      
                          Date Submitted: {submission['submission_date'].slice(0,16).replace('T', ' ')}<br/>
                          Language: {submission['language']}
                          </ListGroup.Item>
                      })}   
                    </ListGroup>               
                  </Tab>
                  <Tab className="question-tab" eventKey="solution" title={<span><FontAwesomeIcon icon={faVideo}/>{" Solution"}</span>}>
                    { question.video_url !== '' ?
                    (<div className='player-wrapper'>
                        <ReactPlayer
                          url={question.video_url}
                          className='react-player'
                          width='100%'
                          height='100%'
                          controls
                          light
                        />
                      </div>
                    ) : (<>Video Solution Coming Soon</>)
                    }
                  </Tab>
                  <Tab className="question-tab" eventKey="discuss" title={<span><FontAwesomeIcon icon={faComments}/>{" Discuss"}</span>}>
                    Comment Section Coming Soon
                  </Tab>

                </Tabs>
              </Col>
              <Col>
                <Row>
                  <Form.Select className="language-select" value={languageSelect} onChange={handleSelectOnChange}>
                  { sampleTestCode.map((example, index) => {
                      return  <option key={index} value={index+1}>{example['language']}</option>
                    })}
                  </Form.Select>
                  <CodeMirror
                    value={ pythonContentVisible ? pythonCode : '' ||
                            javascriptContentVisible ? javascriptCode : '' ||
                            javaContentVisible ? javaCode : ''}
                    height="600px"
                    theme={ sublime }
                    extensions={ pythonContentVisible ? [python()] : [] &&
                                 javascriptContentVisible ? [javascript()] : [] &&
                                 javaContentVisible ? [java()] : []
                                }
                    onChange={codeChange}
                  />
                </Row>
                <Row>
                <Tabs 
                  className="question-tabs"
                  defaultActiveKey="results"
                  id="fill-tab-example"
                  activeKey={resultsTab}
                  onSelect={(k) => setResultsTab(k)}
                  justify
                >
                  <Tab className="question-tab" eventKey="custom" title={<span><FontAwesomeIcon icon={faFlask}/>{" Custom Test"}</span>}>
                  <CodeMirror
                    value={ pythonContentVisible ? pythonTestCode : '' ||
                            javascriptContentVisible ? javascriptTestCode : '' ||
                            javaContentVisible ? javaTestCode : ''}
                    height="300px"
                    theme={ sublime }
                    extensions={  pythonContentVisible ? [python()] : [] &&
                                  javascriptContentVisible ? [javascript()] : [] &&
                                  javaContentVisible ? [java()] : []}
                    onChange={testChange}
                  />                   
                  </Tab>
                  <Tab className="question-tab" eventKey="results" title={<span><FontAwesomeIcon icon={faSquarePollVertical}/>{" Results"}</span>}>
                  { testResults.length == 0 ? 'Test or Submit Code to get Results' : testResults.map((example, index) => {
                      return  <Accordion className="test-result-accordian" key={index}>
                                <Accordion.Item eventKey="0">
                                  <Accordion.Header>Test Result {index + 1}: {example['outcome']}</Accordion.Header>
                                  <Accordion.Body>
                                    <p>{example['error_message']}</p>
                                  </Accordion.Body>
                                </Accordion.Item>
                              </Accordion> 
                    })}

                  </Tab>

                  <Tab className="question-tab" eventKey="console" title={<span><FontAwesomeIcon icon={faTerminal}/>{" Console Output"}</span>}>
                    <div className="console-output">
                      <p>{consoleOutput.length == 0 ? 'Test or Submit Code to get Results' : consoleOutput}</p>
                    </div>
                  </Tab>
                </Tabs>
                </Row>
                <Button variant="secondary" onClick={test_code}>Test</Button>
                <Button variant="primary" onClick={submit}>Submit</Button>
              </Col>
            </Row>

            <Modal  show={showLoginModal} 
                    onHide={handleClose}
                    centered
                    >
              <Modal.Body><LoginForm/></Modal.Body>
            </Modal>
        </>
      )}
    </>
  )
}

export default QuestionPage