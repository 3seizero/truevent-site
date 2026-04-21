import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../../config'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      localStorage.setItem('admin_auth', '1')
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="success-page">
      <div style={{fontSize:'clamp(36px, 8vw, 64px)', fontFamily:"'Roboto', sans-serif", fontWeight:900, letterSpacing:'.18em', color:'var(--white)', marginBottom:'32px'}}>TRUE</div>
      <form onSubmit={handleSubmit} style={{width:'100%', maxWidth:'360px'}}>
        <div style={{fontFamily:"'Roboto Mono', monospace", fontSize:'10px', letterSpacing:'.28em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'24px', textAlign:'center'}}>Admin Access</div>
        <div style={{marginBottom:'12px'}}>
          <input
            className={`field-input${error ? ' field-error' : ''}`}
            type="email"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        <div style={{marginBottom:'12px'}}>
          <input
            className={`field-input${error ? ' field-error' : ''}`}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        {error && <div className="error-msg" style={{textAlign:'center', marginBottom:'12px'}}>{error}</div>}
        <button type="submit" className="submit-btn" style={{width:'100%', maxWidth:'100%'}} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In →'}
        </button>
      </form>
    </div>
  )
}
