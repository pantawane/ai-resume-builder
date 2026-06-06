import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import CoverLetter from "./pages/CoverLetter";
import ATSScore from "./pages/ATSScore";
import TemplateGenerator from "./pages/TemplateGenerator";
import InterviewPrep from "./pages/InterviewPrep";
import BulletSuggestions from "./pages/BulletSuggestions";
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Preview from './pages/Preview'
import Login from './pages/Login'
import { useDispatch } from 'react-redux'
import api from './configs/api'
import { login, setLoading } from './app/features/authSlice'
import {Toaster} from 'react-hot-toast'

const App = () => {

  const dispatch = useDispatch()

  const getUserData = async () => {
    const token = localStorage.getItem('token')
    try {
      if(token){
        const {data} = await api.get('/api/users/data', {headers: {Authorization: `Bearer ${token}`}})
          if(data.user){
            dispatch(login({token, user: data.user}))
          }
          dispatch(setLoading(false))
      }else{
        dispatch(setLoading(false))
      }
    } catch (error) {
       dispatch(setLoading(false))
       console.log(error.message)
    }
  }

  useEffect(()=> {
    getUserData()
  }, [])
  return (
    <>
    <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path='app' element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path='builder/:resumeId' element={<ResumeBuilder />} />
        <Route path="cover-letter" element={<CoverLetter />} />
        <Route path="ats-score" element={<ATSScore />} />
        <Route path="template-generator" element={<TemplateGenerator />} />
        <Route path="interview-prep" element={<InterviewPrep />} />
        <Route path="bullet-suggestions" element={<BulletSuggestions />} />
        </Route>

        <Route path="view/:resumeId" element={<Preview />} />

      </Routes>
    </>
  )
}

export default App
