import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './Pages/LandingPageRelated/LandingPage'
import ApplicationProcess from './Pages/ApplicationRelatedPage/ApplicationProcess'
import SignUp from './Pages/AuthRelatedPage/SignUp'
import Login from './Pages/AuthRelatedPage/Login'
import ClaimProcess from './Pages/ClaimsRelatedPage.jsx/ClaimProcess'
import Dashboard from './Pages/DashboardRelated/Dashboard'
import { Toaster } from 'react-hot-toast'
import VerificationNotification from './Pages/AuthRelatedPage/VerificationNotification'
import EmailVerify from './Pages/AuthRelatedPage/EmailVerify'
import Inpage404 from './Resources/Inpage404.jsx'

export const backendUrl = `${import.meta.env.VITE_BACKEND_URL}/api`
console.log(backendUrl)


function App() {
  return (
    <div className="">
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/application' element={<ApplicationProcess/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/claim' element={<ClaimProcess/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/verify-email' element={<VerificationNotification/>}/>
        <Route path='/verify/:token' element={<EmailVerify/>}/>
        <Route path='*' element={<Inpage404/>}/>
      </Routes>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          className: '',
          duration: 3000,
          style: {
            background: '#333',
            color: '#4F391A',
            fontSize: '16px',
            padding: '10px',
            borderRadius: '7px',
            border: '1px solid #AAC624',
          },
          success: {
            style: {
              background: '#fff',
              color: '#4F391A',
            },
          },
          error: {
            style: {
              background: '#fff',
              color: '#4F391A',
            },
          },
        }}
      />
    </div>
  )
}

export default App
