import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Merasim from './Merasim.jsx'
import { AuthProvider } from './lib/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Merasim />
    </AuthProvider>
  </StrictMode>,
)
