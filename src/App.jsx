import React, { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import LandingPage from './Pages/LandingPageRelated/LandingPage.jsx'
import ApplicationProcess from './Pages/ApplicationRelatedPage/ApplicationProcess'
import SignUp from './Pages/AuthRelatedPage/SignUp'
import Login from './Pages/AuthRelatedPage/Login'
import ClaimProcess from './Pages/ClaimsRelatedPage.jsx/ClaimProcess'
import Dashboard from './Pages/DashboardRelated/Dashboard'
import { Toaster } from 'react-hot-toast'
import VerificationNotification from './Pages/AuthRelatedPage/VerificationNotification'
import EmailVerify from './Pages/AuthRelatedPage/EmailVerify'
import Inpage404 from './Resources/Inpage404.jsx'
import ResetEmail from './Pages/AuthRelatedPage/ResetEmail.jsx'
import PasswordReset from './Pages/AuthRelatedPage/PasswordReset.jsx'
import AddPlatform from './Pages/DashboardRelated/AddPlatform.jsx'

export const backendUrl = `${import.meta.env.VITE_BACKEND_URL}/api`
console.log(backendUrl)

function App() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

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
        <Route path='/reset-email' element={<ResetEmail/>}/>
        <Route path='/reset-password/:token' element={<PasswordReset/>}/>
        <Route path='/dashboard/add-platform' element={<AddPlatform/>}/>
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
