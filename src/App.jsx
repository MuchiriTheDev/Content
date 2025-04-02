import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './Pages/LandingPageRelated/LandingPage'
import ApplicationProcess from './Pages/ApplicationRelatedPage/ApplicationProcess'
import SignUp from './Pages/AuthRelatedPage/SignUp'
import Login from './Pages/AuthRelatedPage/Login'
import ClaimProcess from './Pages/ClaimsRelatedPage.jsx/ClaimProcess'


function App() {
  return (
    <div className="">
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/application' element={<ApplicationProcess/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/claim' element={<ClaimProcess/>}/>
      </Routes>
    </div>
  )
}

export default App
