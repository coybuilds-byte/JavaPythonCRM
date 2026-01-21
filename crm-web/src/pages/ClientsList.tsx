import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Building2 } from 'lucide-react';
import './ClientsList.css';
import ClientForm from '../components/ClientForm';

interface Client {
    id: number;
    companyName: string;
    industry: string;
    contactPerson: string;
    jobOrders?: any[]; // We only need length, type optional for now
}

export default function ClientsList() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const res = await fetch('/api/clients');
            if (!res.ok) throw new Error('Failed to fetch clients');
            const data = await res.json();
            setClients(data);
        } catch (err) {
            console.error(err);
            setError('Could not load clients');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="page-container">Loading...</div>;
    if (error) return <div className="page-container">{error}</div>;

    if (isCreating) {
        return (
            <div className="page-container">
                 <div className="page-header-row">
                    <h1>Add Client</h1>
                 </div>
                 <ClientForm 
                    onSuccess={() => { setIsCreating(false); fetchClients(); }}
                    onCancel={() => setIsCreating(false)}
                 />
            </div>
        )
    }

    return (
        <div className="page-container">
            <div className="page-header-row">
                <h1>Clients</h1>
                <button className="btn-secondary active" onClick={() => setIsCreating(true)}>
                    <Plus size={16} /> Add Client
                </button>
            </div>

            <div className="filter-bar card">
                <div className="search-input">
                    <Search size={18} />
                    <input type="text" placeholder="Search clients..." />
                </div>
            </div>



            <div className="clients-list-view">
                <div className="list-header">
                    <span>Company / Industry</span>
                    <span>Contact Person</span>
                    <span>Open Jobs</span>
                    <span>Location</span>
                </div>
                {clients.map(client => (
                    <Link to={`/clients/${client.id}`} key={client.id} className="client-row card">
                        <div className="client-main-info">
                            <div className="avatar">
                                <Building2 size={24}/>
                            </div>
                            <div>
                                <h3>{client.companyName}</h3>
                                <p className="industry">{client.industry || 'Industry Not Set'}</p>
                            </div>
                        </div>
                        <div>
                            <span style={{color: 'var(--text-primary)'}}>{client.contactPerson}</span>
                        </div>
                        <div>
                             <span className={`status-pill ${client.jobOrders && client.jobOrders.length > 0 ? 'open-jobs' : 'no-jobs'}`}>
                                {client.jobOrders ? client.jobOrders.length : 0} Open Jobs
                            </span>
                        </div>
                        <div style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>
                            {/* Assuming city/state might optionally exist in client object, or fallback */}
                           Location TBD
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
