import { useState, useEffect } from 'react'
import { Route, Routes } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/LoginPage"
import NotFound from "./pages/NotFound"
import Navbar from "./components/Navbar"
import TopicsPage from './pages/TopicsPage'
import RegisterPage from "./pages/RegisterPage"
import LeaderboardsPage from './pages/LeaderboardsPage'
import RewardsPage from './pages/RewardsPage'
import TopicQuestionsPage from './pages/TopicQuestionsPage'
import QuestionPage from './pages/QuestionPage'
import {getCurrentUser} from "./httpClient"
import { User } from './types'
 
function App() {
  const [user, setUser] = useState<User>()

  useEffect(() => {
    const getUser = () => {
      try{
        getCurrentUser()
          .then(res => {
            setUser({id: res.data.id, email: res.data.email})
          })
      } catch (error: any) {
        console.log(error)
      }
    }
    getUser()
  }, [])

  return (
    <>
      <Routes>
        <Route element={<Navbar _user={user!}/>}>
          <Route path='/' element={<LandingPage />} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/topics" element={<TopicsPage/>} />
          <Route path="/topics/:topicUrlPath" element={<TopicQuestionsPage/>} />
          <Route path="/questions/:questionName" element={<QuestionPage _user={user!}/>} />
          <Route path="/leaderboards" element={<LeaderboardsPage/>} />
          <Route path="/rewards" element={<RewardsPage/>} />
          <Route path="*" element={<NotFound/>} />
        </Route>
      </Routes>
    </>
  )
}

export default App
