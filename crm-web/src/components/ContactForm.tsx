import { useState, useEffect } from 'react';

interface ContactFormProps {
    initialData?: any;
    onSave: (data: any) => void;
    onCancel: () => void;
}

export default function ContactForm({ initialData, onSave, onCancel }: ContactFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        email: '',
        phone: '',
        notes: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                role: initialData.role || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                notes: initialData.notes || ''
            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid var(--border)',
        color: 'white',
        borderRadius: '4px',
        marginBottom: '10px'
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{width: '400px'}}>
                <h3>{initialData ? 'Edit Contact' : 'Add New Contact'}</h3>
                <form onSubmit={handleSubmit}>
                    <label style={{display:'block', marginBottom:'4px', fontSize:'0.9rem'}}>Name *</label>
                    <input 
                        type="text" 
                        required 
                        style={inputStyle}
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                    />

                    <label style={{display:'block', marginBottom:'4px', fontSize:'0.9rem'}}>Role / Title</label>
                    <input 
                        type="text" 
                        style={inputStyle}
                        value={formData.role}
                        onChange={e => setFormData({...formData, role: e.target.value})}
                    />

                    <label style={{display:'block', marginBottom:'4px', fontSize:'0.9rem'}}>Email</label>
                    <input 
                        type="email" 
                        style={inputStyle}
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                    />

                    <label style={{display:'block', marginBottom:'4px', fontSize:'0.9rem'}}>Phone</label>
                    <input 
                        type="tel" 
                        style={inputStyle}
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                    />

                    <label style={{display:'block', marginBottom:'4px', fontSize:'0.9rem'}}>Notes</label>
                    <textarea 
                        rows={3}
                        style={{...inputStyle, resize:'vertical'}}
                        value={formData.notes}
                        onChange={e => setFormData({...formData, notes: e.target.value})}
                    />

                    <div style={{display:'flex', gap:'10px', marginTop:'10px'}}>
                        <button type="submit" className="btn-primary" style={{flex:1}}>Save Contact</button>
                        <button type="button" className="btn-secondary" style={{flex:1}} onClick={onCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
