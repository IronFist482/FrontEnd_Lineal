import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './pages/App.jsx'
import Test from './pages/Test.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Test />
  </StrictMode>,
)
