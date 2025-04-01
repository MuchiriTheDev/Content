import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './Pages/LandingPageRelated/LandingPage'
import ApplicationProcess from './Pages/ApplicationRelatedPage/ApplicationProcess'
import SignUp from './Pages/AuthRelatedPage/SignUp'
import Login from './Pages/AuthRelatedPage/Login'


function App() {
  return (
    <div className="">
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/application' element={<ApplicationProcess/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/login' element={<Login />}/>
      </Routes>
    </div>
  )
}

export default App
