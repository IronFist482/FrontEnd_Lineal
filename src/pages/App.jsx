import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import '../styles/App.css'
import AppHome from './Home'
import EspaciosVectoriales from './EspaciosVectoriales'
import Test from './Test'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppHome />} />
        <Route path="/espacios" element={<EspaciosVectoriales />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
