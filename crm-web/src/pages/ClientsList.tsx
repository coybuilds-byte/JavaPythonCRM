import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Search, Plus, Building2 } from 'lucide-react';
import { getCsrfToken } from '../utils/csrf';
import './ClientsList.css';
import ClientForm from '../components/ClientForm';

interface Client {
    id: number;
    companyName: string;
    industry: string;
    contactPerson: string;
    phone?: string;
    jobOrders?: any[]; // We only need length, type optional for now
}

import { DEFAULT_PREFS, type ViewPreferences } from '../components/ViewSettingsModal'; // Import types
import { API_BASE_URL } from '../config';

export default function ClientsList() {
    const { token } = useAuth();
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [viewPrefs, setViewPrefs] = useState<ViewPreferences>(DEFAULT_PREFS);

    useEffect(() => {
        loadPrefs();
        window.addEventListener('view-prefs-changed', loadPrefs);
        fetchClients();
        return () => window.removeEventListener('view-prefs-changed', loadPrefs);
    }, []);

    const loadPrefs = () => {
        const stored = localStorage.getItem('psm_view_prefs');
        if (stored) setViewPrefs(JSON.parse(stored));
    };

    const fetchClients = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/clients`, {
                headers: { 'Authorization': token || '' }
            });
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
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-secondary" onClick={() => document.getElementById('import-file')?.click()}>
                        Simulate Import (Upload Excel)
                    </button>
                    <input
                        type="file"
                        id="import-file"
                        accept=".xlsx"
                        style={{ display: 'none' }}
                        onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                                const formData = new FormData();
                                formData.append('file', e.target.files[0]);
                                try {
                                    const res = await fetch(`${API_BASE_URL}/api/clients/import`, {
                                        method: 'POST',
                                        headers: {
                                            'Authorization': token || '',
                                            'X-XSRF-TOKEN': getCsrfToken() || ''
                                        },
                                        body: formData
                                    });
                                    if (res.ok) {
                                        alert(await res.text());
                                        fetchClients();
                                    } else {
                                        alert("Import failed: " + await res.text());
                                    }
                                } catch (err) {
                                    console.error(err);
                                    alert("Import Error");
                                }
                            }
                        }}
                    />
                    <button className="btn-primary" onClick={() => setIsCreating(true)}>
                        <Plus size={16} /> Add Client
                    </button>
                </div>
            </div>

            <div className="filter-bar card">
                <div className="search-input">
                    <Search size={18} />
                    <input type="text" placeholder="Search clients..." />
                </div>
            </div>



            <div className="clients-list-view">
                <div className="list-header" style={{
                    display: 'grid',
                    gridTemplateColumns: `2fr ${viewPrefs.clients.showContact ? '1.5fr' : ''} ${viewPrefs.clients.showPhone ? '1.2fr' : ''} ${viewPrefs.clients.showJobs ? '1fr' : ''}`,
                    gap: '16px'
                }}>
                    <span>Company / Industry</span>
                    {viewPrefs.clients.showContact && <span>Contact Person</span>}
                    {viewPrefs.clients.showPhone && <span>Phone</span>}
                    {viewPrefs.clients.showJobs && <span>Open Jobs</span>}
                </div>
                {clients.map(client => (
                    <Link to={`/clients/${client.id}`} key={client.id} className="client-row card" style={{
                        display: 'grid',
                        gridTemplateColumns: `2fr ${viewPrefs.clients.showContact ? '1.5fr' : ''} ${viewPrefs.clients.showPhone ? '1.2fr' : ''} ${viewPrefs.clients.showJobs ? '1fr' : ''}`,
                        gap: '16px',
                        alignItems: 'center',
                        textDecoration: 'none'
                    }}>
                        <div className="client-main-info">
                            <div className="avatar">
                                <Building2 size={24} />
                            </div>
                            <div>
                                <h3>{client.companyName}</h3>
                                {viewPrefs.clients.showIndustry && <p className="industry">{client.industry || 'Industry Not Set'}</p>}
                            </div>
                        </div>
                        {viewPrefs.clients.showContact && (
                            <div>
                                <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{client.contactPerson}</span>
                            </div>
                        )}
                        {viewPrefs.clients.showPhone && (
                            <div>
                                <span style={{ color: 'var(--primary-light)' }}>{client.phone || 'N/A'}</span>
                            </div>
                        )}
                        {viewPrefs.clients.showJobs && (
                            <div>
                                <span className={`status-pill ${client.jobOrders && client.jobOrders.length > 0 ? 'open-jobs' : 'no-jobs'}`}>
                                    {client.jobOrders ? client.jobOrders.length : 0} Open Jobs
                                </span>
                            </div>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
}
