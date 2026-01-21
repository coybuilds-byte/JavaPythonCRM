import { useState, useEffect } from 'react';
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
    // salary: string; // Not in backend yet
}

export default function JobOrders() {
    const [jobs, setJobs] = useState<JobOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await fetch('/api/job-orders');
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

    if (loading) return <div className="page-container">Loading...</div>;
    if (error) return <div className="page-container">{error}</div>;

    return (
        <div className="page-container">
            <div className="page-header-row">
                <h1>Job Orders</h1>
                <button className="btn-primary">
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
                    // Derive location from client or default
                    const location = job.client ? `${job.client.city}, ${job.client.state}` : 'Location TBD';
                    // Count candidates
                    const candidateCount = job.candidates ? job.candidates.length : 0;
                    
                    return (
                        <div key={job.id} className="job-card card">
                            <div className="job-header">
                                <div>
                                    <h3>{job.title}</h3>
                                    <p className="client-name">{job.client?.companyName || 'No Client Assigned'}</p>
                                </div>
                                <button className="icon-btn"><MoreHorizontal size={20}/></button>
                            </div>
                            
                            <div className="job-details">
                                <span className="location"><MapPin size={14}/> {location}</span>
                                {/* Placeholder salary until backend has it */}
                                <span className="salary">Salary TBD</span>
                            </div>

                            <div className="job-footer">
                                <span className={`status-pill ${job.status ? job.status.toLowerCase() : 'open'}`}>{job.status || 'Open'}</span>
                                <span className="candidate-count">{candidateCount} Candidates</span>
                            </div>
                        </div>
                    );
                })}
                {jobs.length === 0 && <div style={{padding: 20, textAlign: 'center'}}>No job orders found.</div>}
            </div>
        </div>
    );
}
