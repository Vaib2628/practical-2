import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Contacts from './pages/Contacts'
import { getToken } from './auth'

function RequireAuth({ children }) {
  const token = getToken()
  if (!token) return <Navigate to="/sign-in" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/contacts" element={<RequireAuth><Contacts /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/sign-in" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
