import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('adaptlearn_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = (userData) => {
    // Strip any legacy "level" field — level is per-attempt now
    const { level: _ignored, ...clean } = userData
    setUser(clean)
    localStorage.setItem('adaptlearn_user', JSON.stringify(clean))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('adaptlearn_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
