import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './Pages/LandingPageRelated/LandingPage'
import ApplicationProcess from './Pages/ApplicationRelatedPage/ApplicationProcess'


function App() {
  return (
    <div className="">
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/application' element={<ApplicationProcess/>}/>
      </Routes>
    </div>
  )
}

export default App
