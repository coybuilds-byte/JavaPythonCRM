import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus } from 'lucide-react';
import './CandidatesList.css';
import CandidateUpload from '../components/CandidateUpload';

interface CandidateSummary {
    id: number;
    name: string;
    title: string;
    status: string;
    location: string;
    address?: string; // New
    cell?: string;    // New
}

export default function CandidatesList() {
    const [viewMode, setViewMode] = useState<'list' | 'upload'>('list');
    const [candidates, setCandidates] = useState<CandidateSummary[]>([]);

    useEffect(() => {
        // Mock data for now, replace with fetch
        setCandidates([
            { id: 1, name: 'John Doe', title: 'Senior Software Engineer', status: 'Active', location: 'New York, NY', address: '123 Broadway, NY 10001', cell: '(555) 123-4455' },
            { id: 2, name: 'Sarah Smith', title: 'Product Manager', status: 'Interviewing', location: 'San Francisco, CA', address: '456 Market St, SF 94105', cell: '(555) 987-6543' },
            { id: 3, name: 'Mike Johnson', title: 'Sales Executive', status: 'Placed', location: 'Chicago, IL', address: '789 State St, IL 60601', cell: '(555) 555-1212' },
        ]);
    }, []);

    // ... (Auth Header remains)

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
                            <input type="text" placeholder="Search candidates..." />
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
                        {candidates.map(candidate => (
                            <Link to={`/candidates/${candidate.id}`} key={candidate.id} className="candidate-row card">
                                <div className="candidate-main-info">
                                    <div className="avatar">{candidate.name.charAt(0)}</div>
                                    <div>
                                        <h3>{candidate.name}</h3>
                                        <p className="role">{candidate.title}</p>
                                    </div>
                                </div>
                                <div>
                                    <span className={`status-pill ${candidate.status.toLowerCase()}`}>{candidate.status}</span>
                                </div>
                                <div className="location-info">
                                    <span>{candidate.location}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{candidate.address}</span>
                                </div>
                                <div className="contact-info-col">
                                    <span>{candidate.cell || 'No Cell'}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
