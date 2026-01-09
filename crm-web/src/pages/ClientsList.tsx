import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Building2 } from 'lucide-react';
import './CandidatesList.css'; // Reusing styles for consistency

interface ClientSummary {
    id: number;
    name: string;
    industry: string;
    contact: string;
    openJobs: number;
}

export default function ClientsList() {
    const [clients, setClients] = useState<ClientSummary[]>([]);

    useEffect(() => {
        // Mock data
        setClients([
             { id: 1, name: 'TechCorp Solutions', industry: 'Technology', contact: 'John Doe', openJobs: 3 },
             { id: 2, name: 'Global Finance', industry: 'Finance', contact: 'Jane Smith', openJobs: 1 },
             { id: 3, name: 'HealthPlus', industry: 'Healthcare', contact: 'Dr. Mike', openJobs: 5 },
        ]);
    }, []);

    return (
        <div className="page-container">
            <div className="page-header-row">
                <h1>Clients</h1>
                <button className="btn-secondary active">
                    <Plus size={16} /> Add Client
                </button>
            </div>

            <div className="filter-bar card">
                <div className="search-input">
                    <Search size={18} />
                    <input type="text" placeholder="Search clients..." />
                </div>
            </div>

            <div className="candidates-grid">
                {clients.map(client => (
                    <Link to={`/clients/${client.id}`} key={client.id} className="candidate-card card">
                        <div className="avatar" style={{background: '#fef3c7', color: '#b45309'}}>
                            <Building2 size={24}/>
                        </div>
                        <div className="candidate-info">
                            <h3>{client.name}</h3>
                            <p className="role">{client.industry}</p>
                            <div className="meta">
                                <span className="status-pill interviewing">{client.openJobs} Open Jobs</span>
                                <span className="location">Contact: {client.contact}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
