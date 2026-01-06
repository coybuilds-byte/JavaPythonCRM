import { useState } from 'react'
import '../index.css' // Ensure global styles are applied

interface LoginProps {
    onLogin: (user: string) => void
}

export default function Login({ onLogin }: LoginProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        // Simple client-side check before we have real backend auth connected
        // In Step 2, this will hit the Spring Boot /login endpoint
        if (password === 'Staffpass1!') {
            if (['Jesse@precisionsourcemanagement.com', 'dianeb@precisionsourcemanagement.com', 'kassandra@precisionsourcemanagement.com'].includes(email)) {
                onLogin(email)
            } else {
                setError('Invalid Email or User not authorized')
            }
        } else {
            setError('Invalid Password')
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--primary)' }}>Start Your Deployment</h2> {/* Branding Play */}
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email Address</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="recruiter@precisionsourcemanagement.com"
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
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password</label>
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
                    <button type="submit" className="btn-primary" style={{ marginTop: '1rem', fontWeight: 'bold' }}>
                        LOGIN
                    </button>
                    <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Precision Source Management &copy; 2026
                    </p>
                </form>
            </div>
        </div>
    )
}
