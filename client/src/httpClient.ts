import axios from "axios"

const baseUrl = process.env.REACT_APP_HTTP_BASE_URL

let instance = axios.create({
  withCredentials: true
})


export async function testCode(code: string, language_id: number, question_number: string, test_code: string){
  const json = JSON.stringify({code : code, language_id: language_id, question_number: question_number, custom_input: test_code})
  return await instance.post(baseUrl + '/api/test-code', json, {
                  headers: {
                      'Content-Type': 'application/json'
                  }
                })
}

export async function submitCode(code: string, language_id: number, question_number: string){
  const json = JSON.stringify({code : code, language_id: language_id, question_number: question_number})
  return await instance.post(baseUrl + '/api/submit-code', json, {
                  headers: {
                      'Content-Type': 'application/json'
                  }
                })
}

export async function getCurrentUser(){
  return await instance.get(baseUrl + '/api/getUser')
}

export async function getTopics(){
  return await instance.get(baseUrl + '/api/topics')
}

export async function getTopicQuestions(topic: string | undefined){
  return await instance.get(baseUrl + '/api/topics/' + topic)
}

export async function getQuestion(questionName: string | undefined){
  return await instance.get(baseUrl + '/api/questions/' + questionName)
}

export async function loginUser(params: any){
  await instance.post(baseUrl + '/api/login', params)
}

export async function logoutUser(){
  await instance.post(baseUrl + '/api/logout')
}

export async function loginGithubUser(codeParam: any){
  await instance.get(baseUrl + '/api/github/login?code=' + codeParam)
}

export async function loginGoogleUser(codeParam: any){
  await instance.get(baseUrl + '/api/google/login?code=' + codeParam)
}

export default instance