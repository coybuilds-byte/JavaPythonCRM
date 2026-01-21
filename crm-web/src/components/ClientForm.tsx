import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface ClientFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export default function ClientForm({ onSuccess, onCancel }: ClientFormProps) {
    const { token, user } = useAuth();
    const [formData, setFormData] = useState({
        companyName: '',
        industry: '',
        contactPerson: '',
        email: '',
        phone: '',
        city: '', 
        state: '',
        owner: user || '' // Set initial owner
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/clients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token || ''
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Failed to create client');
            onSuccess();
        } catch (err) {
            console.error(err);
            setError('Failed to create client. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2>Add New Client</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px', marginTop: '20px' }}>
                <div>
                    <label>Company Name</label>
                    <input 
                        type="text" 
                        required
                        value={formData.companyName}
                        onChange={e => setFormData({...formData, companyName: e.target.value})}
                        style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', borderRadius: '4px' }}
                    />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <label>Industry</label>
                        <input 
                            type="text" 
                            required
                            value={formData.industry}
                            onChange={e => setFormData({...formData, industry: e.target.value})}
                            style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', borderRadius: '4px' }}
                        />
                    </div>
                    <div>
                        <label>Contact Person</label>
                        <input 
                            type="text" 
                            required
                            value={formData.contactPerson}
                            onChange={e => setFormData({...formData, contactPerson: e.target.value})}
                            style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', borderRadius: '4px' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <label>Email</label>
                        <input 
                            type="email" 
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', borderRadius: '4px' }}
                        />
                    </div>
                    <div>
                        <label>Phone</label>
                        <input 
                            type="text" 
                            value={formData.phone}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                            style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', borderRadius: '4px' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <label>City</label>
                        <input 
                            type="text" 
                            value={formData.city}
                            onChange={e => setFormData({...formData, city: e.target.value})}
                            style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', borderRadius: '4px' }}
                        />
                    </div>
                    <div>
                        <label>State</label>
                        <input 
                            type="text" 
                            value={formData.state}
                            onChange={e => setFormData({...formData, state: e.target.value})}
                            style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', borderRadius: '4px' }}
                        />
                    </div>
                </div>

                {error && <p style={{ color: 'var(--error)' }}>{error}</p>}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                    <button type="button" onClick={onCancel} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--border)', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? 'Creating...' : 'Create Client'}
                    </button>
                </div>
            </form>
        </div>
    );
}
