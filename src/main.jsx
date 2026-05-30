import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import BekaOS from './BekaOS.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BekaOS />
  </StrictMode>,
)
