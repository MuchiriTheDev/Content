import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './Pages/LandingPage'
import MakeOrder from './Pages/MakeOrder'

function App() {
  return (
    <div className="">
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/course/:id' element={<MakeOrder/>}/>
      </Routes>
    </div>
  )
}

export default App
