import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import { Plus, Filter, MoreHorizontal, MapPin } from 'lucide-react';
import './JobOrders.css';

interface Client {
    id: number;
    companyName: string;
    city: string;
    state: string;
}

interface JobOrder {
    id: number;
    title: string;
    client: Client | null;
    status: string;
    candidates: any[];
    description: string;
    sizzle?: string; // New
    // salary: string; // Not in backend yet
}

export default function JobOrders() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [jobs, setJobs] = useState<JobOrder[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [newJob, setNewJob] = useState({
        title: '',
        clientId: '',
        description: '',
        status: 'Open',
        sizzle: ''
    });

    // View/Edit Modal State
    const [selectedJob, setSelectedJob] = useState<JobOrder | null>(null);

    useEffect(() => {
        fetchJobs();
        fetchClients();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/job-orders`, {
                headers: { 'Authorization': token || '' }
            });
            if (!res.ok) throw new Error('Failed to fetch job orders');
            const data = await res.json();
            setJobs(data);
        } catch (err) {
            console.error(err);
            setError('Could not load jobs');
        } finally {
            setLoading(false);
        }
    };

    const fetchClients = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/clients`, {
                headers: { 'Authorization': token || '' }
            });
            if (res.ok) {
                const data = await res.json();
                setClients(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateJob = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                title: newJob.title,
                description: newJob.description,
                status: newJob.status, // Values are now uppercase in modal
                sizzle: newJob.sizzle,
                client: { id: parseInt(newJob.clientId) },
                openPositions: 1
            };

            const res = await fetch(`${API_BASE_URL}/api/job-orders`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': token || ''
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                fetchJobs();
                setShowModal(false);
                setNewJob({ title: '', clientId: '', description: '', status: 'Open', sizzle: '' });
            } else {
                alert('Failed to create job');
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="page-container">Loading...</div>;
    if (error) return <div className="page-container">{error}</div>;

    return (
        <div className="page-container">
            <div className="page-header-row">
                <h1>Job Orders</h1>
                <button className="btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={16} /> New Job Order
                </button>
            </div>

            <div className="filter-bar card">
                <div className="search-input">
                    <input type="text" placeholder="Search jobs..." />
                </div>
                <div className="filters">
                    <button className="btn-filter"><Filter size={16} /> Status</button>
                </div>
            </div>

            <div className="jobs-list">
                {jobs.map(job => {
                    const location = job.client ? `${job.client.city}, ${job.client.state}` : 'Location TBD';
                    const candidateCount = job.candidates ? job.candidates.length : 0;

                    return (
                        <div
                            key={job.id}
                            className="job-card card"
                            onClick={() => setSelectedJob(job)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="job-header">
                                <div>
                                    <h3>{job.title}</h3>
                                    <p className="client-name">{job.client?.companyName || 'No Client Assigned'}</p>
                                </div>
                                <button className="icon-btn"><MoreHorizontal size={20} /></button>
                            </div>

                            <div className="job-details">
                                <span className="location"><MapPin size={14} /> {location}</span>
                                <span className="salary">Salary TBD</span>
                            </div>

                            <div className="job-footer">
                                <span className={`status-pill ${job.status ? job.status.toLowerCase() : 'open'}`}>{job.status || 'Open'}</span>
                                <span className="candidate-count">{candidateCount} Candidates</span>
                            </div>
                        </div>
                    );
                })}
                {jobs.length === 0 && <div style={{ padding: 20, textAlign: 'center' }}>No job orders found.</div>}
            </div>

            {/* Create Job Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content card">
                        <h2>Create New Job Order</h2>
                        <form onSubmit={handleCreateJob}>
                            <div className="form-group">
                                <label>Job Title</label>
                                <input
                                    type="text"
                                    value={newJob.title}
                                    onChange={e => setNewJob({ ...newJob, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Client</label>
                                <select
                                    value={newJob.clientId}
                                    onChange={e => setNewJob({ ...newJob, clientId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Client...</option>
                                    {clients.map(c => (
                                        <option key={c.id} value={c.id}>{c.companyName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select
                                    value={newJob.status}
                                    onChange={e => setNewJob({ ...newJob, status: e.target.value })}
                                >
                                    <option value="OPEN">Open</option>
                                    <option value="CLOSED">Closed</option>
                                    <option value="HOLD">Hold</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={newJob.description}
                                    onChange={e => setNewJob({ ...newJob, description: e.target.value })}
                                    rows={4}
                                />
                            </div>
                            <div className="form-group">
                                <label>The "Sizzle" (Why work here?)</label>
                                <textarea
                                    value={newJob.sizzle}
                                    onChange={e => setNewJob({ ...newJob, sizzle: e.target.value })}
                                    placeholder="Enter the exciting selling points of this job..."
                                    rows={3}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Create Job</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Job Details Modal */}
            {selectedJob && (
                <div className="modal-overlay" onClick={() => setSelectedJob(null)}>
                    <div className="modal-content card" onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <h2>{selectedJob.title}</h2>
                            <button className="icon-btn" onClick={() => setSelectedJob(null)}>X</button>
                        </div>
                        <p className="client-name" style={{ marginBottom: 16 }}>{selectedJob.client?.companyName}</p>

                        <div className="form-group">
                            <label>Description</label>
                            <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>{selectedJob.description || 'No description provided.'}</p>
                        </div>

                        {selectedJob.sizzle && (
                            <div className="form-group" style={{ marginTop: '12px', padding: '10px', background: 'rgba(255, 215, 0, 0.1)', border: '1px solid rgba(255, 215, 0, 0.3)', borderRadius: '4px' }}>
                                <label style={{ color: '#ffd700' }}>🔥 The Sizzle</label>
                                <p style={{ whiteSpace: 'pre-wrap', marginTop: '4px' }}>{selectedJob.sizzle}</p>
                            </div>
                        )}

                        <div style={{ marginTop: 20 }}>
                            <span className={`status-pill ${selectedJob.status ? selectedJob.status.toLowerCase() : 'open'}`}>{selectedJob.status}</span>
                        </div>

                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setSelectedJob(null)}>Close</button>
                            <button
                                className="btn-secondary"
                                style={{ marginRight: '12px' }}
                                onClick={() => navigate(`/candidates?mode=list&query=${encodeURIComponent(selectedJob.title)}`)}
                            >
                                Search Database
                            </button>
                            <button
                                className="btn-primary"
                                onClick={() => navigate(`/candidates?mode=web-search&query=${encodeURIComponent(selectedJob.title)}`)}
                            >
                                Search Candidates (AI)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
