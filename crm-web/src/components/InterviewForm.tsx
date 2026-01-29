import { useState } from 'react';

interface InterviewFormProps {
    candidateName: string;
    jobTitle: string;
    onSchedule: (date: string, time: string, type: string, notes: string) => void;
    onCancel: () => void;
}

export default function InterviewForm({ candidateName, jobTitle, onSchedule, onCancel }: InterviewFormProps) {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [type, setType] = useState('Phone Screen');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSchedule(date, time, type, notes);
    };

    return (
        <div className="card" style={{ marginTop: '20px', border: '1px solid var(--primary)', animation: 'fadeIn 0.3s' }}>
            <h3 style={{marginBottom: '16px', color: 'var(--primary-light)'}}>
                Schedule Interview
            </h3>
            <p style={{marginBottom: '16px', color: 'var(--text-secondary)'}}>
                For <strong>{candidateName}</strong> - {jobTitle}
            </p>
            
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <label>Date</label>
                        <input 
                            type="date" 
                            required
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', borderRadius: '4px' }}
                        />
                    </div>
                    <div>
                        <label>Time</label>
                        <input 
                            type="time" 
                            required
                            value={time}
                            onChange={e => setTime(e.target.value)}
                            style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', borderRadius: '4px' }}
                        />
                    </div>
                </div>

                <div>
                    <label>Interview Type</label>
                    <select 
                        value={type}
                        onChange={e => setType(e.target.value)}
                        style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', borderRadius: '4px' }}
                    >
                        <option style={{background: '#0f172a', color: 'white'}}>Phone Screen</option>
                        <option style={{background: '#0f172a', color: 'white'}}>Video Interview</option>
                        <option style={{background: '#0f172a', color: 'white'}}>On-Site Interview</option>
                        <option style={{background: '#0f172a', color: 'white'}}>Technical Assessment</option>
                    </select>
                </div>

                <div>
                    <label>Notes / Instructions</label>
                    <textarea 
                        rows={3}
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="e.g. Zoom link, office location..."
                        style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', borderRadius: '4px', resize: 'vertical' }}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button type="button" onClick={onCancel} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--border)', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>Skip / Cancel</button>
                    <button type="submit" className="btn-primary">
                        Confirm Interview
                    </button>
                </div>
            </form>
        </div>
    );
}
