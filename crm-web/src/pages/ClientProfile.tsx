import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Mail, Phone, MapPin, Calendar, FileText } from 'lucide-react';
import './ClientProfile.css';
import JobOrderForm from '../components/JobOrderForm';
import ContactForm from '../components/ContactForm';
import WorkflowModal from '../components/WorkflowModal';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

interface ClientContact {
    id: number;
    name: string;
    role?: string;
    email?: string;
    phone?: string;
    notes?: string;
}

interface Client {
    id: number;
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
    owner?: string;
    logoUrl?: string;
    sizzle?: string;
    contacts?: ClientContact[];
    jobOrders: any[]; // Contains applications
}

interface Candidate {
    id: number;
    name: string;
}

const inputStyle = {
    width: '100%',
    padding: '10px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--border)',
    color: 'white',
    borderRadius: '4px'
};

export default function ClientProfile() {
    const { id } = useParams();
    const { token, user } = useAuth();
    const [client, setClient] = useState<Client | null>(null);
    const [loading, setLoading] = useState(true);

    // Feature States
    const [showJobForm, setShowJobForm] = useState(false);
    const [editingSizzle, setEditingSizzle] = useState(false);
    const [tempSizzle, setTempSizzle] = useState('');

    // Contact State
    const [showContactForm, setShowContactForm] = useState(false);
    const [editingContact, setEditingContact] = useState<any>(null);

    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [selectedCandidate, setSelectedCandidate] = useState('');
    const [selectedJob, setSelectedJob] = useState('');

    // Workflow State
    const [selectedApplication, setSelectedApplication] = useState<any>(null);

    // Activity State
    const [activities, setActivities] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('EMAIL');
    const [newActivityContent, setNewActivityContent] = useState('');

    useEffect(() => {
        fetchClient();
        fetchCandidates();
        fetchActivities();
    }, [id]);

    const fetchActivities = async () => {
        if (!id) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/activities/client/${id}`, {
                headers: { 'Authorization': token || '' }
            });
            if (res.ok) {
                const data = await res.json();
                setActivities(data);
            }
        } catch (err) {
            console.error("Failed to load activities");
        }
    };

    const handleAddActivity = async () => {
        if (!newActivityContent.trim()) return;

        try {
            const payload = {
                type: activeTab, // EMAIL, NOTE, CALL
                content: newActivityContent,
                client: { id: parseInt(id!) }
            };

            const res = await fetch(`${API_BASE_URL}/api/activities`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token || ''
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setNewActivityContent('');
                fetchActivities(); // Refresh list
            }
        } catch (err) {
            console.error(err);
            alert("Failed to log activity");
        }
    };

    const fetchClient = async () => {
        if (!id) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/clients/${id}`, {
                headers: { 'Authorization': token || '' }
            });
            if (res.ok) {
                const data = await res.json();
                setClient(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCandidates = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/candidates`, {
                headers: { 'Authorization': token || '' }
            });
            if (res.ok) {
                const data = await res.json();
                setCandidates(data);
            }
        } catch (err) {
            console.error("Failed to load candidates for dropdown");
        }
    };

    const handleJobSuccess = () => {
        setShowJobForm(false);
        fetchClient();
    };

    const handleAssign = async () => {
        if (!selectedJob || !selectedCandidate) {
            alert("Please select both a Job and a Candidate");
            return;
        }

        try {
            // Apply (create JobApplication)
            const res = await fetch(`${API_BASE_URL}/api/job-orders/${selectedJob}/candidates/${selectedCandidate}`, {
                method: 'POST',
                headers: { 'Authorization': token || '' }
            });

            if (res.ok) {
                alert("Candidate Applied! You can now manage their status.");
                setSelectedCandidate('');
                fetchClient();
            } else {
                const txt = await res.text();
                alert(txt);
            }
        } catch (err) {
            console.error(err);
            alert("Error assigning candidate.");
        }
    };

    const handleUpdateApplication = async (status: string, details: any) => {
        if (!selectedApplication) return;
        try {
            const sendPrep = details.sendPrepEmail ? 'true' : 'false';
            // Remove non-entity fields from payload if needed, but JobApplication ignoring unknown props is likely fine.
            // Actually, let's keep payload clean.
            const { sendPrepEmail, ...cleanDetails } = details;

            const payload = {
                status,
                ...cleanDetails
            };

            const res = await fetch(`${API_BASE_URL}/api/applications/${selectedApplication.id}/status?sendPrepEmail=${sendPrep}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': token || '' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Application Updated!");
                setSelectedApplication(null);
                fetchClient(); // Refresh to see new status
            } else {
                alert("Failed to update application");
            }
        } catch (e) { console.error(e); }
    };

    // Helper to flatten applications for view
    const getAllApplications = () => {
        if (!client || !client.jobOrders) return [];
        return client.jobOrders.flatMap((job: any) =>
            (job.applications || []).map((app: any) => ({ ...app, jobTitle: job.title }))
        );
    };

    const applications = getAllApplications();

    // Helper to get clean payload (exclude lists to avoid backend merge issues)
    const getCleanClientPayload = (updates: Partial<Client>) => {
        if (!client) return {};
        const { jobOrders, contacts, ...cleanClient } = client;
        return { ...cleanClient, ...updates };
    };

    // Use File Upload for Logo
    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result as string;

            // Optimistic update
            setClient(prev => prev ? ({ ...prev, logoUrl: base64String }) : null);

            try {
                const res = await fetch(`${API_BASE_URL}/api/clients/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': token || '' },
                    body: JSON.stringify(getCleanClientPayload({ logoUrl: base64String }))
                });
                if (res.ok) fetchClient();
                else alert("Failed to save logo.");
            } catch (err) { console.error(err); alert("Error saving logo"); }
        };
        reader.readAsDataURL(file);
    };

    const saveSizzle = async () => {
        try {
            // Optimistic update
            setClient(prev => prev ? ({ ...prev, sizzle: tempSizzle }) : null);

            await fetch(`${API_BASE_URL}/api/clients/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': token || '' },
                body: JSON.stringify(getCleanClientPayload({ sizzle: tempSizzle }))
            });
            setEditingSizzle(false);
            fetchClient(); // Refresh to be sure
        } catch (e) { console.error(e); }
    }

    const handleSaveContact = async (contactData: any) => {
        try {
            const isEdit = !!editingContact;
            const url = isEdit ? `${API_BASE_URL}/api/contacts/${editingContact.id}` : `${API_BASE_URL}/api/contacts`;
            const method = isEdit ? 'PUT' : 'POST';

            const payload = { ...contactData, client: { id: parseInt(id!) } };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': token || '' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setShowContactForm(false);
                fetchClient(); // Reload client to get updated contacts list
            } else {
                alert("Failed to save contact");
            }
        } catch (e) { console.error(e); alert("Error saving contact"); }
    };

    const handleDeleteContact = async (contactId: number) => {
        if (!confirm("Are you sure you want to delete this contact?")) return;
        try {
            await fetch(`${API_BASE_URL}/api/contacts/${contactId}`, {
                method: 'DELETE',
                headers: { 'Authorization': token || '' }
            });
            fetchClient();
        } catch (e) { console.error(e); }
    };

    if (loading) return <div className="page-container">Loading...</div>;
    if (!client) return <div className="page-container">Client not found</div>;

    return (
        <div className="client-profile-container">
            {/* LEFT COLUMN */}
            <div className="client-left">
                {/* Client Info Card */}
                <div className="card client-info-card">
                    <div className="card-header-simple">Client Info</div>
                    <div className="client-main-info">
                        <div
                            className="client-logo-placeholder"
                            style={{
                                position: 'relative',
                                overflow: 'hidden',
                                backgroundImage: client.logoUrl ? `url(${client.logoUrl})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: client.logoUrl ? 'transparent' : 'white',
                                border: '1px dashed var(--border)'
                            }}
                        >
                            <label style={{ cursor: 'pointer', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {client.logoUrl ? '' : 'Upload Logo'}
                                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} />
                            </label>
                        </div>
                        <div className="client-text">
                            <h2>{client.companyName}</h2>
                            <p className="contact-person">Primary: {client.contactPerson}</p>
                            <div className="contact-row"><Mail size={14} /> {client.email}</div>
                            <div className="contact-row"><Phone size={14} /> {client.phone}</div>
                            <div className="contact-row"><MapPin size={14} /> {client.address}</div>
                            <div className="contact-row" style={{ marginTop: '8px', fontSize: '0.9em', color: 'var(--primary-light)' }}>
                                <strong>Owner:</strong> {client.owner || 'None'}
                            </div>
                        </div>
                    </div>
                    {/* Sizzle Section */}
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <strong style={{ color: '#ffd700' }}>🔥 The Sizzle (Why work here?)</strong>
                            {!editingSizzle ? (
                                <button className="btn-text-small" onClick={() => { setTempSizzle(client.sizzle || ''); setEditingSizzle(true); }}>Edit</button>
                            ) : (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button className="btn-text-small" onClick={saveSizzle}>Save</button>
                                    <button className="btn-text-small" onClick={() => setEditingSizzle(false)} style={{ color: 'gray' }}>Cancel</button>
                                </div>
                            )}
                        </div>
                        {editingSizzle ? (
                            <textarea
                                style={{ ...inputStyle, minHeight: '100px' }}
                                value={tempSizzle}
                                onChange={e => setTempSizzle(e.target.value)}
                                placeholder="Enter the selling points..."
                            />
                        ) : (
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                                {client.sizzle || "No sizzle added yet. Click edit to add!"}
                            </p>
                        )}
                    </div>
                </div>

                {/* Important Contacts List */}
                <div className="card contacts-card" style={{ marginTop: '16px' }}>
                    <div className="card-header-simple" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Important Contacts</span>
                        <button className="btn-small" onClick={() => { setEditingContact(null); setShowContactForm(true); }}>+ Add</button>
                    </div>
                    {client.contacts && client.contacts.length > 0 ? (
                        <div className="contacts-list">
                            {client.contacts.map(c => (
                                <div key={c.id} style={{ padding: '10px', borderBottom: '1px solid var(--border)', fontSize: '0.9rem', position: 'relative' }}>
                                    <div style={{ fontWeight: 'bold' }}>{c.name} <span style={{ fontWeight: 'normal', color: 'gray' }}>({c.role})</span></div>
                                    <div style={{ display: 'flex', gap: '12px', marginTop: '4px', color: 'var(--primary-light)' }}>
                                        <span>{c.email}</span>
                                        <span>{c.phone}</span>
                                    </div>
                                    {c.notes && <div style={{ marginTop: '4px', fontStyle: 'italic', color: 'gray' }}>"{c.notes}"</div>}

                                    <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '8px' }}>
                                        <button className="btn-text-small" style={{ color: 'var(--text-secondary)' }} onClick={() => { setEditingContact(c); setShowContactForm(true); }}>Edit</button>
                                        <button className="btn-text-small" style={{ color: 'red' }} onClick={() => handleDeleteContact(c.id)}>×</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ padding: '16px', color: 'gray', fontStyle: 'italic' }}>No additional contacts.</div>
                    )}
                </div>

                {showContactForm && (
                    <ContactForm
                        initialData={editingContact}
                        onSave={handleSaveContact}
                        onCancel={() => setShowContactForm(false)}
                    />
                )}

                {/* Communication Log */}
                <div className="card communication-card">
                    <div className="card-header-simple">Communication Log</div>
                    <div className="comms-tabs">
                        <button className={`tab ${activeTab === 'EMAIL' ? 'active' : ''}`} onClick={() => setActiveTab('EMAIL')}>Emails</button>
                        <button className={`tab ${activeTab === 'NOTE' ? 'active' : ''}`} onClick={() => setActiveTab('NOTE')}>Notes</button>
                        <button className={`tab ${activeTab === 'CALL' ? 'active' : ''}`} onClick={() => setActiveTab('CALL')}>Calls</button>
                    </div>

                    {/* Quick Add Action: Email Specific or Note/Call */}
                    {activeTab === 'EMAIL' ? (
                        <div style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ display: 'grid', gap: '8px', marginBottom: '8px' }}>
                                <input
                                    type="text"
                                    placeholder="Subject"
                                    id="email-subject"
                                    style={inputStyle}
                                />
                                <textarea
                                    rows={3}
                                    placeholder="Email body..."
                                    id="email-body"
                                    style={{ ...inputStyle, resize: 'vertical' }}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '4px 12px' }} onClick={async () => {
                                    const subject = (document.getElementById('email-subject') as HTMLInputElement).value;
                                    const body = (document.getElementById('email-body') as HTMLTextAreaElement).value;
                                    if (!subject || !body) return alert("Subject and Body required");

                                    try {
                                        const res = await fetch(`${API_BASE_URL}/api/email/send`, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json', 'Authorization': token || '' },
                                            body: JSON.stringify({
                                                to: client?.email,
                                                subject,
                                                body
                                            })
                                        });
                                        if (!res.ok) throw new Error("Failed to send");

                                        await fetch(`${API_BASE_URL}/api/activities`, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json', 'Authorization': token || '' },
                                            body: JSON.stringify({
                                                type: 'EMAIL',
                                                content: `Subject: ${subject} - Body: ${body}`,
                                                client: { id: parseInt(id!) }
                                            })
                                        });

                                        alert("Email Sent!");
                                        (document.getElementById('email-subject') as HTMLInputElement).value = '';
                                        (document.getElementById('email-body') as HTMLTextAreaElement).value = '';
                                        fetchActivities();

                                    } catch (e) {
                                        console.error(e);
                                        alert("Error sending email (Check backend logs for SMTP issues)");
                                    }
                                }}>
                                    Send Email
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
                            <input
                                type="text"
                                placeholder={`Add a new ${activeTab.toLowerCase()}...`}
                                value={newActivityContent}
                                onChange={(e) => setNewActivityContent(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleAddActivity();
                                }}
                                style={inputStyle}
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                                <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '4px 12px' }} onClick={handleAddActivity}>
                                    + Log {activeTab === 'CALL' ? 'Call' : 'Note'}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="log-list">
                        {activities.filter(a => a.type === activeTab).length === 0 ? (
                            <div style={{ padding: '20px', color: 'var(--text-secondary)', fontStyle: 'italic', textAlign: 'center' }}>
                                No {activeTab.toLowerCase()}s logged yet.
                            </div>
                        ) : (
                            activities.filter(a => a.type === activeTab).map(activity => (
                                <div key={activity.id} className="log-item">
                                    {activeTab === 'EMAIL' ? <Mail size={16} className="comm-icon" /> :
                                        activeTab === 'CALL' ? <Phone size={16} className="comm-icon" /> :
                                            <FileText size={16} className="comm-icon" />}

                                    <div className="comm-content">
                                        <span>{activity.content}</span>
                                        <span className="comm-label">{new Date(activity.timestamp).toLocaleString()}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="client-right">

                {/* Applications Board (NEW) */}
                <div className="card" style={{ marginBottom: '20px' }}>
                    <div className="card-header-simple">Active Applications</div>
                    {applications.length === 0 ? (
                        <div style={{ padding: '20px', textAlign: 'center', color: 'gray' }}>No active candidates. Assign one below.</div>
                    ) : (
                        <div className="applications-list" style={{ display: 'grid', gap: '10px' }}>
                            {applications.map((app: any) => (
                                <div key={app.id} style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    padding: '12px',
                                    borderRadius: '6px',
                                    borderLeft: `4px solid ${app.status === 'INTERVIEW_SCHEDULED' ? '#3b82f6' : app.status === 'HIRED' ? '#10b981' : 'gray'}`,
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{app.candidate.name}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>For: {app.jobTitle}</div>
                                        <div style={{ marginTop: '4px' }}>
                                            <span className={`status-pill ${app.status.toLowerCase()}`}>{app.status.replace('_', ' ')}</span>
                                            {app.interviewDate && (
                                                <span style={{ marginLeft: '10px', fontSize: '0.8rem', color: '#ffd700' }}>
                                                    📅 {new Date(app.interviewDate).toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button className="btn-secondary" onClick={() => setSelectedApplication(app)}>Manage</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Candidate Assignment */}
                <div className="card assignment-card">
                    <div className="card-header-simple">Quick Apply</div>

                    {user === client.owner ? (
                        <div className="assignment-body">
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <select
                                    className="candidate-select"
                                    value={selectedJob}
                                    onChange={(e) => setSelectedJob(e.target.value)}
                                >
                                    <option value="">Select Job...</option>
                                    {client.jobOrders && client.jobOrders.map(job => (
                                        <option key={job.id} value={job.id}>{job.title}</option>
                                    ))}
                                </select>

                                <select
                                    className="candidate-select"
                                    value={selectedCandidate}
                                    onChange={(e) => setSelectedCandidate(e.target.value)}
                                >
                                    <option value="">Select Candidate...</option>
                                    {candidates.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <button className="btn-block" onClick={handleAssign} style={{ marginTop: '10px' }} disabled={!selectedJob || !selectedCandidate}>
                                + Add to Pipeline
                            </button>
                        </div>
                    ) : (
                        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            <p>Only the Client Owner ({client.owner || 'Unknown'}) can assign candidates.</p>
                        </div>
                    )}
                </div>

                {/* Job Orders */}
                <div className="card job-orders-card">
                    <div className="card-header-simple" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Job Orders</span>
                    </div>

                    {!showJobForm ? (
                        <>
                            <table className="job-table-clean">
                                <thead>
                                    <tr>
                                        <th>Job Title</th>
                                        <th>Status</th>
                                        <th>Open Positions</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {client.jobOrders && client.jobOrders.map(job => (
                                        <tr key={job.id}>
                                            <td>{job.title}</td>
                                            <td><span className={`status-pill ${job.status ? job.status.toLowerCase().replace(' ', '-') : 'open'}`}>{job.status || 'OPEN'}</span></td>
                                            <td>{job.openPositions || job.positions}</td>
                                            <td>{job.date || 'Today'}</td>
                                        </tr>
                                    ))}
                                    {(!client.jobOrders || client.jobOrders.length === 0) && (
                                        <tr><td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>No active job orders</td></tr>
                                    )}
                                </tbody>
                            </table>
                            <button className="btn-block-dashed" onClick={() => setShowJobForm(true)}>+ Add Job Order</button>
                        </>
                    ) : (
                        <JobOrderForm
                            clientId={client.id}
                            onSuccess={handleJobSuccess}
                            onCancel={() => setShowJobForm(false)}
                        />
                    )}
                </div>

                {/* Activity Timeline */}
                <div className="card timeline-card">
                    <div className="card-header-simple">Activity Timeline</div>
                    <div className="timeline-list">
                        {/* We will eventually map real activities here */}
                        <div className="timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <span>Activity logs will appear here.</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Workflow Modal for Managing Application */}
            {selectedApplication && (
                <WorkflowModal
                    application={selectedApplication}
                    onSave={handleUpdateApplication}
                    onClose={() => setSelectedApplication(null)}
                />
            )}
        </div>
    );
}
