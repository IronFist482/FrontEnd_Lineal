import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import '../styles/App.css'
import AppHome from './Home'
import EspaciosVectoriales from './EspaciosVectoriales'
import Test from './Test'
import Logbook from './Logbook';
import ProtectedRoute from '../components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>


      <Routes>
        <Route path="/" element={<AppHome />} />
        <Route path="/espacios" element={<EspaciosVectoriales />} />
        <Route path="/test" element={<Test />} />
        <Route
          path="/logbook"
          element={
            <ProtectedRoute>
              <Logbook />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
