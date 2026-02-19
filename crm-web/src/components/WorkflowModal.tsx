import { useState } from 'react';

interface WorkflowModalProps {
    application: any;
    onSave: (status: string, details: any) => void;
    onClose: () => void;
}

export default function WorkflowModal({ application, onSave, onClose }: WorkflowModalProps) {
    const [status, setStatus] = useState(application.status || 'APPLIED');

    // Interview Details
    const [date, setDate] = useState(application.interviewDate ? application.interviewDate.split('T')[0] : '');
    const [time, setTime] = useState(application.interviewDate ? application.interviewDate.split('T')[1]?.substring(0, 5) : '');
    const [location, setLocation] = useState(application.interviewLocation || '');
    const [notes, setNotes] = useState(application.notes || '');
    const [sendEmail, setSendEmail] = useState(false);

    const handleSave = () => {
        let details: any = { notes, sendPrepEmail: sendEmail };
        if (status === 'INTERVIEW_SCHEDULED') {
            if (!date || !time) return alert("Date and Time required for interview");
            details.interviewDate = `${date}T${time}:00`;
            details.interviewLocation = location;
        }
        onSave(status, details);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ width: '500px' }}>
                <h3>Manage Application</h3>
                <p><strong>Candidate:</strong> {application.candidate.name}</p>
                <p><strong>Job:</strong> {application.jobTitle || application.jobOrder?.title || 'Unknown Job'}</p>

                <div style={{ margin: '20px 0' }}>
                    <label>Current Status</label>
                    <select
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                        style={{ width: '100%', padding: '10px', marginTop: '5px', background: '#0f172a', color: 'white', border: '1px solid var(--border)' }}
                    >
                        <option value="APPLIED">Applied</option>
                        <option value="SCREENING">Screening</option>
                        <option value="INTERVIEW_SCHEDULED">Interview</option>
                        <option value="OFFER">Offer</option>
                        <option value="HIRED">Hired</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>

                {status === 'INTERVIEW_SCHEDULED' && (
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                        <h4 style={{ marginBottom: '10px', color: 'var(--primary-light)' }}>Interview Details</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                            <div>
                                <label>Date</label>
                                <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: '100%', padding: '8px' }} />
                            </div>
                            <div>
                                <label>Time</label>
                                <input type="time" value={time} onChange={e => setTime(e.target.value)} style={{ width: '100%', padding: '8px' }} />
                            </div>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Location / Zoom Link</label>
                            <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Zoom URL or Address" style={{ width: '100%', padding: '8px' }} />
                        </div>

                        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input
                                type="checkbox"
                                id="sendPrepEmail"
                                checked={sendEmail}
                                onChange={(e) => setSendEmail(e.target.checked)}
                                style={{ width: 'auto' }}
                            />
                            <label htmlFor="sendPrepEmail" style={{ cursor: 'pointer', color: '#ffd700' }}>Send Interview Prep Email to Candidate?</label>
                        </div>
                    </div>
                )}

                <div>
                    <label>Notes</label>
                    <textarea
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        rows={3}
                        placeholder="Add internal notes..."
                        style={{ width: '100%', padding: '8px', marginTop: '5px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border)' }}
                    />
                </div>

                <div className="modal-actions" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button className="btn-text" onClick={onClose}>Cancel</button>
                    <button className="btn-primary" onClick={handleSave}>Save Updates</button>
                </div>
            </div>
        </div>
    );
}
