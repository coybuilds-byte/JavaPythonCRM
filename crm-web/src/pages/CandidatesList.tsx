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
}

export default function CandidatesList() {
    const [viewMode, setViewMode] = useState<'list' | 'upload'>('list');
    const [candidates, setCandidates] = useState<CandidateSummary[]>([]);

    useEffect(() => {
        // Mock data for now, replace with fetch
        setCandidates([
            { id: 1, name: 'John Doe', title: 'Senior Software Engineer', status: 'Active', location: 'New York, NY' },
            { id: 2, name: 'Sarah Smith', title: 'Product Manager', status: 'Interviewing', location: 'San Francisco, CA' },
            { id: 3, name: 'Mike Johnson', title: 'Sales Executive', status: 'Placed', location: 'Chicago, IL' },
        ]);
    }, []);

    // Basic Auth for 'jesse@precisionsourcemanagement.com:Staffpass1!'
    // Base64 of jesse@precisionsourcemanagement.com:Staffpass1! is amVzc2VAcHJlY2lzaW9uc291cmNlbWFuYWdlbWVudC5jb206U3RhZmZwYXNzMSE=
    // In a real app this comes from Login state
    const authHeader = "Basic amVzc2VAcHJlY2lzaW9uc291cmNlbWFuYWdlbWVudC5jb206U3RhZmZwYXNzMSE=";

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

                    <div className="candidates-grid">
                        {candidates.map(candidate => (
                            <Link to={`/candidates/${candidate.id}`} key={candidate.id} className="candidate-card card">
                                <div className="avatar">{candidate.name.charAt(0)}</div>
                                <div className="candidate-info">
                                    <h3>{candidate.name}</h3>
                                    <p className="role">{candidate.title}</p>
                                    <div className="meta">
                                        <span className={`status-pill ${candidate.status.toLowerCase()}`}>{candidate.status}</span>
                                        <span className="location">{candidate.location}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
