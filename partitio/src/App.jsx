// App.jsx
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignUp from './pages/auth/signup.jsx'
import Login from './pages/auth/login.jsx'
import Dashboard from './pages/dashboard/dashboard.jsx'
import Piece from './pages/piece/piece.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/piece" element={<Piece />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
