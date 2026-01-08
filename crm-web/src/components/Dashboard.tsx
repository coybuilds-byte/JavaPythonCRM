import { useState } from 'react'
import CandidateUpload from './CandidateUpload'

interface DashboardProps {
    user: string
    authHeader: string
    onLogout: () => void
}

export default function Dashboard({ user, authHeader, onLogout }: DashboardProps) {
    const [view, setView] = useState<'candidates' | 'clients'>('candidates')

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Navigation Bar */}
            <nav style={{ 
                borderBottom: '1px solid var(--border)', 
                padding: '0.75rem 2rem', 
                background: 'rgba(12, 26, 50, 0.95)', 
                backdropFilter: 'blur(8px)',
                position: 'sticky',
                top: 0,
                zIndex: 10
            }}>
                <div className="container" style={{ padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: 28, height: 28, borderRadius: 4, background: 'var(--primary)' }}></div>
                        <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'white' }}>Precision CRM</span>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                         <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', fontWeight: 500 }}>
                            <span 
                                onClick={() => setView('candidates')}
                                style={{ 
                                    cursor: 'pointer', 
                                    color: view === 'candidates' ? 'var(--primary)' : 'var(--text-secondary)',
                                    borderBottom: view === 'candidates' ? '2px solid var(--primary)' : 'none',
                                    paddingBottom: '4px'
                                }}
                            >
                                Candidates
                            </span>
                            <span 
                                onClick={() => setView('clients')}
                                style={{ 
                                    cursor: 'pointer', 
                                    color: view === 'clients' ? 'var(--primary)' : 'var(--text-secondary)',
                                    borderBottom: view === 'clients' ? '2px solid var(--primary)' : 'none',
                                    paddingBottom: '4px'
                                }}
                            >
                                Clients
                            </span>
                        </div>
                        <div style={{ height: '20px', width: '1px', background: 'var(--border)' }}></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{user}</span>
                            <button 
                                onClick={onLogout}
                                style={{ 
                                    background: 'transparent', 
                                    border: '1px solid var(--border)', 
                                    color: 'var(--text)',
                                    padding: '0.4rem 1rem',
                                    borderRadius: '4px',
                                    fontSize: '0.8rem'
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="container" style={{ flex: 1, marginTop: '2rem', width: '100%' }}>
                {view === 'candidates' && (
                    <div className="fade-in">
                        <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                                Candidate Management
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                                AI-Powered Resume Parsing & Matching
                            </p>
                        </header>
                        <CandidateUpload authHeader={authHeader} />
                    </div>
                )}

                {view === 'clients' && (
                    <div className="fade-in" style={{ textAlign: 'center', marginTop: '4rem' }}>
                        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem' }}>
                            <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Client Management</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                                Manage company profiles, job orders, and hiring contacts.
                            </p>
                            <div style={{ padding: '1rem', background: 'rgba(247, 181, 0, 0.1)', borderRadius: '8px', color: 'var(--primary)' }}>
                                🚧 Client Module Under Construction
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
