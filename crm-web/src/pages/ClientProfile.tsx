import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Mail, Phone, MapPin, Plus, UserPlus, Calendar, Briefcase, FileText } from 'lucide-react';
import './ClientProfile.css';
import JobOrderForm from '../components/JobOrderForm';
import InterviewForm from '../components/InterviewForm';
import ContactForm from '../components/ContactForm';
import { useAuth } from '../context/AuthContext';

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
    logoUrl?: string; // New
    sizzle?: string; // New
    contacts?: ClientContact[]; // New
    jobOrders: any[];
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
    const [showInterviewForm, setShowInterviewForm] = useState(false);
    const [editingSizzle, setEditingSizzle] = useState(false);
    const [tempSizzle, setTempSizzle] = useState('');
    
    // Contact State
    const [showContactForm, setShowContactForm] = useState(false);
    const [editingContact, setEditingContact] = useState<any>(null);
    
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [selectedCandidate, setSelectedCandidate] = useState('');
    const [selectedJob, setSelectedJob] = useState('');
    
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
            const res = await fetch(`/api/activities/client/${id}`);
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

            const res = await fetch('/api/activities', {
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
             const res = await fetch(`/api/clients/${id}`);
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
            const res = await fetch('/api/candidates');
            if(res.ok) {
                const data = await res.json();
                setCandidates(data);
            }
        } catch(err) {
            console.error("Failed to load candidates for dropdown");
        }
    };

    const handleJobSuccess = () => {
        setShowJobForm(false);
        fetchClient(); 
    };

    const handleAssign = () => {
        if(!selectedJob || !selectedCandidate) {
            alert("Please select both a Job and a Candidate");
            return;
        }
        setShowInterviewForm(true);
    };

    const handleScheduleInterview = async (date: string, time: string, type: string, notes: string) => {
        try {
            const candidateName = candidates.find(c => c.id.toString() === selectedCandidate)?.name || 'Candidate';
            const jobTitle = client!.jobOrders?.find((j: any) => j.id.toString() === selectedJob)?.title || 'Job';

            // 1. Assign Candidate
            await fetch(`/api/job-orders/${selectedJob}/candidates/${selectedCandidate}`, {
                 method: 'POST',
                 headers: {'Authorization': token || ''}
            });
            
            // 2. Log Interview Activity
            const activityPayload = {
                type: 'INTERVIEW',
                content: `Scheduled ${type} with ${candidateName} for ${jobTitle} on ${date} at ${time}. Notes: ${notes}`,
                client: { id: parseInt(id!) },
                candidate: { id: parseInt(selectedCandidate) }
            };

            const res = await fetch('/api/activities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token || ''
                },
                body: JSON.stringify(activityPayload)
            });

            if(!res.ok) throw new Error("Failed to save interview activity.");
            
            // 3. Send Emails (Automated)
            await fetch('/api/email/send', {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'Authorization': token || ''},
                body: JSON.stringify({
                    to: user ? user.email : 'recruiter@precisionsourcemanagement.com', 
                    subject: `Interview Confirmation: ${candidateName} for ${jobTitle}`,
                    body: `Interview scheduled for ${date} at ${time}.\nCandidate: ${candidateName}\nType: ${type}\nNotes: ${notes}`
                 })
            });
            
            // 4. Schedule "Prep Call" (Day Prior)
            const interviewDate = new Date(date);
            const prepDate = new Date(interviewDate);
            prepDate.setDate(prepDate.getDate() - 1);
            const prepDateStr = prepDate.toISOString().split('T')[0];
            
            const prepPayload = {
                 type: 'CALL',
                 content: `PREP CALL for ${candidateName} (Interview on ${date}). Schedule for ${prepDateStr}.`,
                 client: { id: parseInt(id!) },
                 candidate: { id: parseInt(selectedCandidate) }
            };
             await fetch('/api/activities', {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'Authorization': token || ''},
                body: JSON.stringify(prepPayload)
            });


            alert("Candidate Assigned, Interview Scheduled, Confirmation Sent, and Prep Call Task Logged!");
            setShowInterviewForm(false);
            setSelectedCandidate('');
            setSelectedJob('');
            fetchActivities();

        } catch(err) {
            console.error(err);
            alert("Error scheduling interview workflow.");
        }
    };

    // Helper to get clean payload (exclude lists to avoid backend merge issues)
    const getCleanClientPayload = (updates: Partial<Client>) => {
        if(!client) return {};
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
                const res = await fetch(`/api/clients/${id}`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json', 'Authorization': token || ''},
                    body: JSON.stringify(getCleanClientPayload({ logoUrl: base64String }))
                });
                if(res.ok) fetchClient();
                else alert("Failed to save logo.");
            } catch(err) { console.error(err); alert("Error saving logo"); }
        };
        reader.readAsDataURL(file);
    };

    const saveSizzle = async () => {
         try {
            // Optimistic update
            setClient(prev => prev ? ({ ...prev, sizzle: tempSizzle }) : null);

            await fetch(`/api/clients/${id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json', 'Authorization': token || ''},
                body: JSON.stringify(getCleanClientPayload({ sizzle: tempSizzle }))
            });
            setEditingSizzle(false);
            fetchClient(); // Refresh to be sure
        } catch(e) { console.error(e); }
    }

    const handleSaveContact = async (contactData: any) => {
        try {
            const isEdit = !!editingContact;
            const url = isEdit ? `/api/contacts/${editingContact.id}` : '/api/contacts';
            const method = isEdit ? 'PUT' : 'POST';
            
            const payload = { ...contactData, client: { id: parseInt(id!) } };

            const res = await fetch(url, {
                method,
                headers: {'Content-Type': 'application/json', 'Authorization': token || ''},
                body: JSON.stringify(payload)
            });

            if(res.ok) {
                setShowContactForm(false);
                fetchClient(); // Reload client to get updated contacts list
            } else {
                alert("Failed to save contact");
            }
        } catch(e) { console.error(e); alert("Error saving contact"); }
    };

    const handleDeleteContact = async (contactId: number) => {
        if(!confirm("Are you sure you want to delete this contact?")) return;
        try {
            await fetch(`/api/contacts/${contactId}`, {
                method: 'DELETE',
                headers: {'Authorization': token || ''}
            });
            fetchClient();
        } catch(e) { console.error(e); }
    };

    if(loading) return <div className="page-container">Loading...</div>;
    if(!client) return <div className="page-container">Client not found</div>;

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
                                backgroundSize:'cover',
                                backgroundPosition:'center',
                                display: 'flex', alignItems:'center', justifyContent:'center',
                                color: client.logoUrl ? 'transparent' : 'white',
                                border: '1px dashed var(--border)'
                            }}
                         >
                            <label style={{cursor:'pointer', width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                {client.logoUrl ? '' : 'Upload Logo'}
                                <input type="file" accept="image/*" style={{display:'none'}} onChange={handleLogoUpload} />
                            </label>
                         </div>
                         <div className="client-text">
                             <h2>{client.companyName}</h2>
                             <p className="contact-person">Primary: {client.contactPerson}</p>
                             <div className="contact-row"><Mail size={14}/> {client.email}</div>
                             <div className="contact-row"><Phone size={14}/> {client.phone}</div>
                             <div className="contact-row"><MapPin size={14}/> {client.address}</div>
                             <div className="contact-row" style={{marginTop:'8px', fontSize: '0.9em', color: 'var(--primary-light)'}}>
                                 <strong>Owner:</strong> {client.owner || 'None'}
                             </div>
                         </div>
                    </div>
                    {/* Sizzle Section */}
                    <div style={{marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)'}}>
                        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'8px'}}>
                            <strong style={{color:'#ffd700'}}>🔥 The Sizzle (Why work here?)</strong>
                            {!editingSizzle ? (
                                <button className="btn-text-small" onClick={() => { setTempSizzle(client.sizzle || ''); setEditingSizzle(true); }}>Edit</button>
                            ) : (
                                <div style={{display:'flex', gap:'8px'}}>
                                    <button className="btn-text-small" onClick={saveSizzle}>Save</button>
                                    <button className="btn-text-small" onClick={() => setEditingSizzle(false)} style={{color:'gray'}}>Cancel</button>
                                </div>
                            )}
                        </div>
                        {editingSizzle ? (
                            <textarea 
                                style={{...inputStyle, minHeight:'100px'}} 
                                value={tempSizzle} 
                                onChange={e => setTempSizzle(e.target.value)} 
                                placeholder="Enter the selling points..."
                            />
                        ) : (
                            <p style={{fontSize:'0.9rem', color: 'var(--text-secondary)', whiteSpace:'pre-wrap'}}>
                                {client.sizzle || "No sizzle added yet. Click edit to add!"}
                            </p>
                        )}
                    </div>
                </div>

                {/* Important Contacts List */}
                <div className="card contacts-card" style={{marginTop:'16px'}}>
                    <div className="card-header-simple" style={{display:'flex', justifyContent:'space-between'}}>
                        <span>Important Contacts</span>
                         <button className="btn-small" onClick={() => { setEditingContact(null); setShowContactForm(true); }}>+ Add</button>
                    </div>
                    {client.contacts && client.contacts.length > 0 ? (
                        <div className="contacts-list">
                            {client.contacts.map(c => (
                                <div key={c.id} style={{padding:'10px', borderBottom:'1px solid var(--border)', fontSize:'0.9rem', position:'relative'}}>
                                    <div style={{fontWeight:'bold'}}>{c.name} <span style={{fontWeight:'normal', color:'gray'}}>({c.role})</span></div>
                                    <div style={{display:'flex', gap:'12px', marginTop:'4px', color:'var(--primary-light)'}}>
                                        <span>{c.email}</span>
                                        <span>{c.phone}</span>
                                    </div>
                                    {c.notes && <div style={{marginTop:'4px', fontStyle:'italic', color:'gray'}}>"{c.notes}"</div>}
                                    
                                    <div style={{position:'absolute', top:'10px', right:'10px', display:'flex', gap:'8px'}}>
                                        <button className="btn-text-small" style={{color:'var(--text-secondary)'}} onClick={() => { setEditingContact(c); setShowContactForm(true); }}>Edit</button>
                                        <button className="btn-text-small" style={{color:'red'}} onClick={() => handleDeleteContact(c.id)}>×</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{padding:'16px', color:'gray', fontStyle:'italic'}}>No additional contacts.</div>
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
                        <div style={{padding: '16px', borderBottom: '1px solid var(--border)'}}>
                            <div style={{display:'grid', gap:'8px', marginBottom:'8px'}}>
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
                                    style={{...inputStyle, resize:'vertical'}}
                                />
                            </div>
                            <div style={{display:'flex', justifyContent:'flex-end'}}>
                                <button className="btn-secondary" style={{fontSize:'0.8rem', padding:'4px 12px'}} onClick={async () => {
                                    const subject = (document.getElementById('email-subject') as HTMLInputElement).value;
                                    const body = (document.getElementById('email-body') as HTMLTextAreaElement).value;
                                    if(!subject || !body) return alert("Subject and Body required");
                                    
                                    try {
                                        const res = await fetch('/api/email/send', {
                                            method: 'POST',
                                            headers: {'Content-Type': 'application/json', 'Authorization': token || ''},
                                            body: JSON.stringify({
                                                to: client?.email,
                                                subject,
                                                body
                                            })
                                        });
                                        if(!res.ok) throw new Error("Failed to send");
                                        
                                        await fetch('/api/activities', {
                                            method: 'POST',
                                            headers: {'Content-Type': 'application/json', 'Authorization': token || ''},
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

                                    } catch(e) {
                                        console.error(e);
                                        alert("Error sending email (Check backend logs for SMTP issues)");
                                    }
                                }}>
                                    Send Email
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={{padding: '16px', borderBottom: '1px solid var(--border)'}}>
                            <input 
                                type="text" 
                                placeholder={`Add a new ${activeTab.toLowerCase()}...`}
                                value={newActivityContent}
                                onChange={(e) => setNewActivityContent(e.target.value)}
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter') handleAddActivity();
                                }}
                                style={inputStyle}
                            />
                            <div style={{display:'flex', justifyContent:'flex-end', marginTop:'8px'}}>
                                <button className="btn-secondary" style={{fontSize:'0.8rem', padding:'4px 12px'}} onClick={handleAddActivity}>
                                    + Log {activeTab === 'CALL' ? 'Call' : 'Note'}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="log-list">
                        {activities.filter(a => a.type === activeTab).length === 0 ? (
                             <div style={{padding:'20px', color:'var(--text-secondary)', fontStyle:'italic', textAlign: 'center'}}>
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
                
                {/* Job Orders */}
                 <div className="card job-orders-card">
                    <div className="card-header-simple" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
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
                                        <tr><td colSpan={4} style={{textAlign:'center', padding:'20px'}}>No active job orders</td></tr>
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

                 {/* Candidate Assignment - Restricted to Owner */}
                 <div className="card assignment-card">
                    <div className="card-header-simple">Candidate Assignment</div>
                    
                    {user === client.owner ? (
                        <div className="assignment-body">
                             {!showInterviewForm ? (
                                <>
                                    <p className="helper-text">Select Job & Candidate:</p>
                                    
                                    {/* Job Select */}
                                    <select 
                                        className="candidate-select" 
                                        style={{marginBottom: '10px'}}
                                        value={selectedJob}
                                        onChange={(e) => setSelectedJob(e.target.value)}
                                    >
                                        <option value="">Select Job Order...</option>
                                        {client.jobOrders && client.jobOrders.map(job => (
                                            <option key={job.id} value={job.id}>{job.title}</option>
                                        ))}
                                    </select>
            
                                    {/* Candidate Select */}
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
                                    
                                    <button className="btn-block" onClick={handleAssign} style={{marginTop: '16px'}}>Assign Candidate</button>
                                </>
                             ) : (
                                <InterviewForm 
                                    candidateName={candidates.find(c => c.id.toString() === selectedCandidate)?.name || 'Candidate'}
                                    jobTitle={client.jobOrders?.find((j: any) => j.id.toString() === selectedJob)?.title || 'Job'}
                                    onSchedule={handleScheduleInterview}
                                    onCancel={() => setShowInterviewForm(false)}
                                />
                             )}
                        </div>
                    ) : (
                        <div style={{padding: '20px', textAlign: 'center', color: 'var(--text-secondary)'}}>
                            <p>Only the Client Owner ({client.owner || 'Unknown'}) can assign candidates.</p>
                        </div>
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
        </div>
    );
}
