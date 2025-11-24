import { useState } from 'react'
import { api } from '../api'
import { setToken } from '../auth'
import { Link, useNavigate } from 'react-router-dom'

export default function SignIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const { data } = await api.post('/sign-in', { email, password })
      setToken(data.token)
      navigate('/contacts')
    } catch (err) {
      setError('Invalid email or password')
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '40px auto' }}>
      <h2>Sign In</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Sign In</button>
      </form>
      <p>
        No account? <Link to="/sign-up">Sign Up</Link>
      </p>
    </div>
  )
}

