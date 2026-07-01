// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignUp from './pages/auth/signup.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
