import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

interface JobOrderFormProps {
    clientId: number;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function JobOrderForm({ clientId, onSuccess, onCancel }: JobOrderFormProps) {
    const { token } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        status: 'OPEN',
        openPositions: 1,
        description: '',
        client: { id: clientId } // Bind to current client
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${API_BASE_URL}/api/job-orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token || ''
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Failed to create job order');
            onSuccess();
        } catch (err) {
            console.error(err);
            setError('Failed to create job order.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ marginTop: '20px', border: '1px solid var(--primary)' }}>
            <h3 style={{marginBottom: '16px', color: 'var(--primary-light)'}}>Create New Job Order</h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
                <div>
                    <label>Job Title</label>
                    <input 
                        type="text" 
                        required
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', borderRadius: '4px' }}
                    />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <label>Status</label>
                        <select 
                            value={formData.status}
                            onChange={e => setFormData({...formData, status: e.target.value})}
                            style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', borderRadius: '4px' }}
                        >
                            <option value="OPEN">Open</option>
                            <option value="CLOSED">Closed</option>
                            <option value="HOLD">On Hold</option>
                        </select>
                    </div>
                    <div>
                        <label>Open Positions</label>
                        <input 
                            type="number" 
                            min="1"
                            value={formData.openPositions}
                            onChange={e => setFormData({...formData, openPositions: parseInt(e.target.value)})}
                            style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', borderRadius: '4px' }}
                        />
                    </div>
                </div>

                <div>
                    <label>Description</label>
                    <textarea 
                        rows={3}
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', borderRadius: '4px', resize: 'vertical' }}
                    />
                </div>

                {error && <p style={{ color: 'var(--error)' }}>{error}</p>}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button type="button" onClick={onCancel} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--border)', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? 'Creating...' : 'Create Job'}
                    </button>
                </div>
            </form>
        </div>
    );
}
