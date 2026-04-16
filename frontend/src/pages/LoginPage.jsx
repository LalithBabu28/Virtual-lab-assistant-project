import { useState } from 'react'
import { useAuth } from '../components/AuthContext'
import { api } from '../api/client'

export default function LoginPage() {
  const { login } = useAuth()

  const [role, setRole] = useState('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await api.login(email, password, role)

      // ✅ Validate backend response
      if (!data || !data.token) {
        throw new Error("Invalid server response")
      }

      // ✅ Store user in auth context
      login(data)

    } catch (err) {
      // ✅ Handle backend + network errors safely
      const message =
        err?.response?.data?.detail ||
        err?.message ||
        "Login failed"

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Background Effects */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        left: '-10%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute',
        bottom: '-20%',
        right: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="fade-up" style={{ width: '100%', maxWidth: '420px', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'linear-gradient(135deg, var(--accent), var(--accent3))',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.6rem',
            margin: '0 auto 1rem',
          }}>
            ⬡
          </div>

          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>
            AdaptLearn
          </h1>

          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Adaptive Learning Platform
          </p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>

          {/* Role Selector */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            background: 'var(--bg3)',
            padding: '0.3rem',
            borderRadius: 'var(--radius2)',
          }}>
            {['student', 'teacher'].map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                style={{
                  padding: '0.6rem',
                  borderRadius: '6px',
                  background: role === r ? 'var(--accent)' : 'transparent',
                  color: role === r ? '#fff' : 'var(--text2)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  transition: 'all 0.2s',
                  textTransform: 'capitalize',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {r === 'teacher' ? '👨‍🏫' : '👤'} {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >

            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                className="input"
                placeholder={role === 'teacher'
                  ? 'admin@school.com'
                  : 'student@email.com'}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary btn-lg w-full"
              disabled={loading}
            >
              {loading
                ? (
                  <>
                    <span className="spinner" style={{ width: 16, height: 16 }} />
                    {' '}Signing in…
                  </>
                )
                : 'Sign In'
              }
            </button>
          </form>

          <div className="divider" />

        </div>
      </div>
    </div>
  )
}