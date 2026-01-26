import { useState } from 'react';
import { Send, X } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';

interface BroadcastModalProps {
    onClose: () => void;
}

export default function BroadcastModal({ onClose }: BroadcastModalProps) {
    const { token } = useAuth();
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    const handleSend = async () => {
        if (!message.trim()) return;
        setStatus('Sending...');
        try {
            const res = await fetch(`${API_BASE_URL}/api/notifications/broadcast`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token || ''
                },
                body: JSON.stringify({ message })
            });

            if (res.ok) {
                setStatus('Sent!');
                setTimeout(onClose, 1000);
            } else {
                setStatus('Failed to send');
            }
        } catch (e) {
            console.error(e);
            setStatus('Error sending');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '400px' }}>
                <div className="modal-header">
                    <h2>📢 Team Broadcast</h2>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>
                <div className="modal-body">
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        Post a message to the entire team. It will appear in their notification bell.
                    </p>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your announcement..."
                        style={{
                            width: '100%',
                            minHeight: '100px',
                            padding: '0.75rem',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--border)',
                            borderRadius: '4px',
                            color: 'white',
                            marginBottom: '1rem'
                        }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.9rem', color: status === 'Sent!' ? 'green' : 'red' }}>{status}</span>
                        <button className="btn-primary" onClick={handleSend} disabled={!message.trim() || status === 'Sending...'}>
                            <Send size={16} /> Post Message
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
