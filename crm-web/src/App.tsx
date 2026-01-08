import { useState } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

function App() {
  const [user, setUser] = useState<string | null>(null)
  const [authHeader, setAuthHeader] = useState<string | null>(null)

  const handleLogin = (email: string, auth: string) => {
    setUser(email)
    setAuthHeader(auth)
  }

  const handleLogout = () => {
    setUser(null)
    setAuthHeader(null)
  }

  if (!user || !authHeader) {
    return <Login onLogin={handleLogin} />
  }

  return <Dashboard user={user} authHeader={authHeader} onLogout={handleLogout} />
}

export default App
