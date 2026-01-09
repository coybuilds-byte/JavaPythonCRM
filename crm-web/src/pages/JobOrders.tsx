import { useState, useEffect } from 'react';
import { Plus, Filter, MoreHorizontal, MapPin } from 'lucide-react';
import './JobOrders.css';

interface JobOrder {
    id: number;
    title: string;
    client: string;
    location: string;
    status: 'Open' | 'Interviewing' | 'Closed';
    candidatesCount: number;
    salary: string;
}

export default function JobOrders() {
    const [jobs, setJobs] = useState<JobOrder[]>([]);

    useEffect(() => {
        // Mock data
        setJobs([
            { id: 1, title: 'Senior Java Developer', client: 'TechCorp', location: 'Remote', status: 'Open', candidatesCount: 12, salary: '$140k - $160k' },
            { id: 2, title: 'Product Manager', client: 'Global Finance', location: 'New York, NY', status: 'Interviewing', candidatesCount: 4, salary: '$120k - $140k' },
            { id: 3, title: 'DevOps Engineer', client: 'HealthPlus', location: 'Austin, TX', status: 'Open', candidatesCount: 8, salary: '$130k' },
        ]);
    }, []);

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
                {jobs.map(job => (
                    <div key={job.id} className="job-card card">
                        <div className="job-header">
                            <div>
                                <h3>{job.title}</h3>
                                <p className="client-name">{job.client}</p>
                            </div>
                            <button className="icon-btn"><MoreHorizontal size={20}/></button>
                        </div>
                        
                        <div className="job-details">
                            <span className="location"><MapPin size={14}/> {job.location}</span>
                            <span className="salary">{job.salary}</span>
                        </div>

                        <div className="job-footer">
                            <span className={`status-pill ${job.status.toLowerCase()}`}>{job.status}</span>
                            <span className="candidate-count">{job.candidatesCount} Candidates</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
