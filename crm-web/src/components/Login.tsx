import { useState } from 'react'
import '../index.css'

interface LoginProps {
    onLogin: (user: string, authHeader: string) => void
}

export default function Login({ onLogin }: LoginProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isForgotPassword, setIsForgotPassword] = useState(false)
    const [resetSent, setResetSent] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        // Create Basic Auth Header
        const auth = 'Basic ' + btoa(email + ':' + password)
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'

        try {
            // Verify credentials by hitting a protected endpoint
            const response = await fetch(`${apiUrl}/api/candidates/health`, {
                headers: { 'Authorization': auth }
            })

            if (response.ok) {
                onLogin(email, auth)
            } else {
                if (response.status === 401) {
                    setError('Invalid Email or Password')
                } else {
                    setError('Login failed. Please try again.')
                }
            }
        } catch (err) {
            console.error(err)
            // Fallback for demo/offline if API not reachable, but strictly warn
            if (password === 'Staffpass1!') {
                 console.warn("API unreachable, falling back to local check for demo")
                 onLogin(email, auth)
            } else {
                 setError('Unable to connect to server')
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleForgotPassword = (e: React.FormEvent) => {
        e.preventDefault()
        // Mock sending reset logic
        setResetSent(true)
    }

    if (isForgotPassword) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>Reset Password</h2>
                    {!resetSent ? (
                        <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.9rem' }}>
                                Enter your email address and we'll send you a link to reset your password.
                            </p>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Address"
                                style={{ 
                                    width: '100%', 
                                    padding: '0.75rem', 
                                    background: 'rgba(255,255,255,0.05)', 
                                    border: '1px solid var(--border)', 
                                    borderRadius: '4px',
                                    color: 'white'
                                }}
                                required
                            />
                            <button type="submit" className="btn-primary" style={{ fontWeight: 'bold' }}>
                                Send Reset Link
                            </button>
                            <button 
                                type="button" 
                                onClick={() => { setIsForgotPassword(false); setResetSent(false); }}
                                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                Back to Login
                            </button>
                        </form>
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
                            <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Check your inbox</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                                We've sent a password reset link to <strong>{email}</strong>.
                            </p>
                            <button 
                                className="btn-primary" 
                                onClick={() => { setIsForgotPassword(false); setResetSent(false); }}
                            >
                                Return to Login
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--primary)' }}>Precision CRM</h2>
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email Address</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ 
                                width: '100%', 
                                padding: '0.75rem', 
                                background: 'rgba(255,255,255,0.05)', 
                                border: '1px solid var(--border)', 
                                borderRadius: '4px',
                                color: 'white'
                            }}
                            required
                        />
                    </div>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <label style={{ fontSize: '0.9rem' }}>Password</label>
                            <span 
                                onClick={() => setIsForgotPassword(true)}
                                style={{ fontSize: '0.8rem', color: 'var(--primary)', cursor: 'pointer' }}
                            >
                                Forgot Password?
                            </span>
                        </div>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ 
                                width: '100%', 
                                padding: '0.75rem', 
                                background: 'rgba(255,255,255,0.05)', 
                                border: '1px solid var(--border)', 
                                borderRadius: '4px',
                                color: 'white'
                            }}
                            required
                        />
                    </div>
                    {error && <p style={{ color: 'var(--error)', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}
                    <button 
                        type="submit" 
                        className="btn-primary" 
                        disabled={isLoading}
                        style={{ marginTop: '1rem', fontWeight: 'bold', opacity: isLoading ? 0.7 : 1 }}
                    >
                        {isLoading ? 'Verifying...' : 'LOGIN'}
                    </button>
                </form>
            </div>
        </div>
    )
}
