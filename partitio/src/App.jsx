// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignUp from './pages/auth/signup.jsx'
import Login from './pages/auth/login.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App