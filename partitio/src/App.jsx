import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignUp from './pages/auth/signup/signup.jsx'
import Login from './pages/auth/login/login.jsx'
import Dashboard from './pages/dashboard/dashboard.jsx'
import Piece from './pages/piece/piece.jsx'
import Profil from './pages/profil/profilpage.jsx'
import Documents from './pages/documents/documents.jsx'
import Ensemble from './pages/ensembles/ensembles.jsx'
import Users from './pages/users/users.jsx'
import Roles from './pages/roles/roles.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/piece" element={<Piece />} />
        <Route path="/profilpage" element={<Profil />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/ensembles" element={<Ensemble />} />
        <Route path="/users" element={<Users />} />
        <Route path="/roles" element={<Roles />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;