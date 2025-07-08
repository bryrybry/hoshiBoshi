/* eslint-disable react/react-in-jsx-scope */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Hoshi from './Hoshi.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Hoshi />
  </StrictMode>,
)
