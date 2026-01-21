import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus } from 'lucide-react';
import './CandidatesList.css';
import CandidateUpload from '../components/CandidateUpload';
import { useAuth } from '../context/AuthContext';

interface Candidate {
    id: number;
    name: string;
    currentTitle: string; // Changed from title to match backend
    status: string;
    location: string;
    address?: string;
    cell?: string;
    email: string;
    phone: string;
}

export default function CandidatesList() {
    const [viewMode, setViewMode] = useState<'list' | 'upload'>('list');
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(false);
    
    const { token } = useAuth();
    const authHeader = token || '';
 

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            if (viewMode === 'list') {
                fetchCandidates();
            }
        }, 300); // Debounce search
        return () => clearTimeout(timer);
    }, [viewMode, searchQuery]);

    const fetchCandidates = async () => {
        setLoading(true);
        try {
            const url = searchQuery 
                ? `/api/candidates/search?query=${encodeURIComponent(searchQuery)}` 
                : '/api/candidates';
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setCandidates(data);
            }
        } catch (error) {
            console.error('Error fetching candidates:', error);
        } finally {
            setLoading(false);
        }
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
                         <div className="list-header">
                            <span>Name / Role</span>
                            <span>Status</span>
                            <span>Location</span>
                            <span>Contact</span>
                         </div>
                        {loading ? <div style={{padding:20}}>Loading...</div> : candidates.map(candidate => (
                            <Link to={`/candidates/${candidate.id}`} key={candidate.id} className="candidate-row card">
                                <div className="candidate-main-info">
                                    <div className="avatar">{candidate.name ? candidate.name.charAt(0) : '?'}</div>
                                    <div>
                                        <h3>{candidate.name}</h3>
                                        <p className="role">{candidate.currentTitle || 'No Title'}</p>
                                    </div>
                                </div>
                                <div>
                                    <span className={`status-pill ${candidate.status ? candidate.status.toLowerCase() : 'new'}`}>{candidate.status || 'New'}</span>
                                </div>
                                <div className="location-info">
                                    <span>{candidate.location}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{candidate.address}</span>
                                </div>
                                <div className="contact-info-col">
                                    <span>{candidate.cell || candidate.phone || 'No Contact'}</span>
                                </div>
                            </Link>
                        ))}
                        {!loading && candidates.length === 0 && <div style={{padding:20, textAlign:'center'}}>No candidates found. Upload a resume to get started.</div>}
                    </div>
                </>
            )}
        </div>
    );
}
