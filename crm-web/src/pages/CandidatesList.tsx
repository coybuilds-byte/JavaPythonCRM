import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Filter, Plus } from 'lucide-react';
import './CandidatesList.css';
import CandidateUpload from '../components/CandidateUpload';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

interface Candidate {
    id: number;
    name: string;
    currentTitle: string;
    status: string;
    location: string;
    address?: string;
    cell?: string;
    email: string;
    phone: string;
}

import { DEFAULT_PREFS } from '../components/ViewSettingsModal';
import type { ViewPreferences } from '../components/ViewSettingsModal';

export default function CandidatesList() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialMode = queryParams.get('mode') === 'web-search' ? 'web-search' : 'list';
    const initialQuery = queryParams.get('query') || '';

    const [viewMode, setViewMode] = useState<'list' | 'upload' | 'web-search'>(initialMode as any);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [error, setError] = useState('');
    const [viewPrefs, setViewPrefs] = useState<ViewPreferences>(DEFAULT_PREFS);

    const { token } = useAuth();
    const authHeader = token || '';

    // Function to handle Web Search (defined before effects)
    const handleWebSearch = async (queryOverride?: string) => {
        const queryToSearch = queryOverride || searchQuery;
        if (!queryToSearch) return;

        setLoading(true);
        setError('');
        try {
            // Proxy through our own backend (using unified base URL)
            const res = await fetch(`${API_BASE_URL}/api/candidates/web-search?query=${encodeURIComponent(queryToSearch)}`);
            if (res.ok) {
                const d = await res.json();
                // The python service returns {"results": [...]}, and our Java proxy returns that body directly.
                const results = d.results || [];
                setCandidates(results.map((r: any, i: number) => ({
                    id: -i - 1, // negative ID for external
                    name: r.title,
                    currentTitle: 'External Match',
                    status: 'Web',
                    location: 'Unknown',
                    email: 'N/A',
                    phone: 'N/A',
                    resumeText: r.body,
                    href: r.href
                })));
            } else {
                setError('Search service returned an error.');
            }
        } catch (e) {
            console.error(e);
            setError('Could not connect to AI Search Service. Please ensure it is running.');
        } finally {
            setLoading(false);
        }
    };

    const fetchCandidates = async () => {
        setLoading(true);
        setError('');
        try {
            const url = searchQuery
                ? `${API_BASE_URL}/api/candidates/search?query=${encodeURIComponent(searchQuery)}`
                : `${API_BASE_URL}/api/candidates`;
            const res = await fetch(url, { headers: { 'Authorization': token || '' } });

            if (!res.ok) {
                const errorText = await res.text().catch(() => 'No detail');
                throw new Error(`Fetch Candidates Failed: ${res.status} ${errorText}`);
            }

            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Expected JSON response for candidates, but received non-JSON content.");
            }

            const data = await res.json();
            setCandidates(data);
        } catch (err) {
            console.error(err);
            setError('Could not load candidates');
        } finally {
            setLoading(false);
        }
    };

    // Effect to auto-search if query provided via URL in web-search mode
    useEffect(() => {
        if (initialMode === 'web-search' && initialQuery) {
            handleWebSearch(initialQuery);
        }
    }, [initialMode, initialQuery]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (viewMode === 'list') {
                fetchCandidates();
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [viewMode, searchQuery]);

    useEffect(() => {
        loadPrefs();
        window.addEventListener('view-prefs-changed', loadPrefs);
        return () => window.removeEventListener('view-prefs-changed', loadPrefs);
    }, []);

    const loadPrefs = () => {
        const stored = localStorage.getItem('psm_view_prefs');
        if (stored) setViewPrefs(JSON.parse(stored));
    };

    return (
        <div className="page-container">
            <div className="page-header-row">
                <h1>Candidates</h1>
                <div className="header-actions">
                    <button
                        className={`btn-secondary ${viewMode === 'upload' ? 'active' : ''}`}
                        onClick={() => setViewMode('upload')}
                    >
                        <Plus size={16} /> Add / Upload
                    </button>
                    <button
                        className={`btn-secondary ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                    >
                        View List
                    </button>
                    <button
                        className={`btn-secondary ${viewMode === 'web-search' ? 'active' : ''}`}
                        onClick={() => setViewMode('web-search')}
                    >
                        Web Search (AI)
                    </button>
                </div>
            </div>

            {viewMode === 'upload' ? (
                <div className="upload-container-wrapper">
                    <div className="card upload-card-centered">
                        <h2>Upload Resume</h2>
                        <p className="subtitle">Parse a new candidate resume to auto-create a profile.</p>
                        <CandidateUpload authHeader={authHeader} />
                    </div>
                </div>
            ) : viewMode === 'web-search' ? (
                <div className="web-search-view">
                    <div className="card" style={{ padding: '2rem' }}>
                        <h2>AI Web Search</h2>
                        {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
                        <p>Search the public web (LinkedIn, GitHub) for potential candidates.</p>
                        <div className="search-input" style={{ marginTop: '1rem' }}>
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Enter skills, job titles, keywords..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleWebSearch();
                                }}
                            />
                            <button className="btn-primary" onClick={() => handleWebSearch()} disabled={loading}>
                                {loading ? 'Searching...' : 'Search'}
                            </button>
                        </div>
                        <div style={{ marginTop: '1rem', fontStyle: 'italic', color: 'gray' }}>
                            Results will appear in the list below.
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="filter-bar card">
                        <div className="search-input">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search candidates (skills, name, resume)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="filters">
                            <button className="btn-filter"><Filter size={16} /> Status</button>
                            <button className="btn-filter"><Filter size={16} /> Location</button>
                        </div>
                    </div>

                    <div className="candidates-list-view">
                        <div className="list-header" style={{
                            display: 'grid',
                            gridTemplateColumns: `2fr ${viewPrefs.candidates.showTitle ? '1.5fr' : ''} ${viewPrefs.candidates.showStatus ? '1fr' : ''} ${viewPrefs.candidates.showSkills ? '1.5fr' : ''} 1.5fr`,
                            gap: '16px'
                        }}>
                            <span>Name</span>
                            {viewPrefs.candidates.showTitle && <span>Current Role</span>}
                            {viewPrefs.candidates.showStatus && <span>Status</span>}
                            {viewPrefs.candidates.showSkills && <span>Skills</span>}
                            <span>Location / Contact</span>
                        </div>
                        {error && !loading && <div className="error-message card" style={{ padding: '1rem', color: 'red' }}>{error}</div>}
                        {loading ? <div style={{ padding: 20 }}>Loading...</div> : candidates.map(candidate => (
                            <div key={candidate.id} className="candidate-row card" style={{
                                ...(candidate.id < 0 ? { borderLeft: '4px solid #ab935a' } : {}),
                                display: 'grid',
                                gridTemplateColumns: `2fr ${viewPrefs.candidates.showTitle ? '1.5fr' : ''} ${viewPrefs.candidates.showStatus ? '1fr' : ''} ${viewPrefs.candidates.showSkills ? '1.5fr' : ''} 1.5fr`,
                                gap: '16px',
                                alignItems: 'center'
                            }}>
                                <div className="candidate-main-info">
                                    <div className="avatar">{candidate.id < 0 ? 'W' : (candidate.name ? candidate.name.charAt(0) : '?')}</div>
                                    <div>
                                        <h3>
                                            {candidate.id < 0 ? <a href={(candidate as any).href} target="_blank" rel="noreferrer">{candidate.name}</a> : <Link to={`/candidates/${candidate.id}`}>{candidate.name}</Link>}
                                        </h3>
                                    </div>
                                </div>

                                {viewPrefs.candidates.showTitle && (
                                    <p className="role" style={{ margin: 0 }}>{candidate.currentTitle || 'No Title'}</p>
                                )}

                                {viewPrefs.candidates.showStatus && (
                                    <div>
                                        <span className={`status-pill ${candidate.status ? candidate.status.toLowerCase() : 'new'}`}>{candidate.status || 'New'}</span>
                                    </div>
                                )}

                                {viewPrefs.candidates.showSkills && (
                                    <div style={{ fontSize: '0.85rem', color: 'gray' }}>
                                        {/* Placeholder for skills if not in main list yet */}
                                        Skills...
                                    </div>
                                )}

                                <div>
                                    <div className="location-info">
                                        <span>{candidate.location}</span>
                                    </div>
                                    <div className="contact-info-col">
                                        <span style={{ fontSize: '0.85rem', color: 'var(--primary-light)' }}>{candidate.cell || candidate.phone || 'No Contact'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {!loading && candidates.length === 0 && !error && <div style={{ padding: 20, textAlign: 'center' }}>No candidates found.</div>}
                    </div>
                </>
            )}
        </div>
    );
}
