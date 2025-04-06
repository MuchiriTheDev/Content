import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { GeneralProvider } from './Context/GeneralContext.jsx'
import { ApiProvider } from './Context/ApiContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <GeneralProvider>
        <ApiProvider>
          <App />
        </ApiProvider>
      </GeneralProvider>
    </BrowserRouter>
  </StrictMode>,
)
