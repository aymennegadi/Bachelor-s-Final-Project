import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter as Router, Routes} from "react-router-dom"
import './index.css'
import App from './App.jsx'
import RoleProvider from './contexts/RoleContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <RoleProvider>
        <App />
      </RoleProvider>
    </Router>
  </StrictMode>
)
