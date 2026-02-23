import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe, Linkedin, FileText, ExternalLink, Calendar, MapPinHouse, Send, Tag, Pencil, Trash2, Clock, Briefcase, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import { getCsrfToken } from '../utils/csrf';
import './CandidateProfile.css';

interface Candidate {
    id: number;
    name: string;
    email: string;
    phone: string;
    status: string;
    location: string;
    skills: string[];
    currentTitle?: string;
    resumeText: string;
}

export default function CandidateProfile() {
    const { id } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [candidate, setCandidate] = useState<Candidate | null>(null);
    const [loading, setLoading] = useState(true);

    const [openJobs, setOpenJobs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const headers = { 'Authorization': token || '' };
                const [candRes, jobsRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/candidates/${id}`, { headers }),
                    fetch(`${API_BASE_URL}/api/job-orders`, { headers })
                ]);

                if (!candRes.ok) {
                    const errorMsg = await candRes.text().catch(() => 'No error detail');
                    throw new Error(`Candidate Fetch Failed: ${candRes.status} ${errorMsg}`);
                }

                const candType = candRes.headers.get("content-type");
                if (!candType || !candType.includes("application/json")) {
                    throw new Error("Expected JSON response for candidate, but received non-JSON content.");
                }
                const candData = await candRes.json();
                setCandidate(candData);

                if (jobsRes.ok) {
                    const jobsType = jobsRes.headers.get("content-type");
                    if (jobsType && jobsType.includes("application/json")) {
                        const jobsData = await jobsRes.json();
                        setOpenJobs(jobsData.filter((j: any) => j.status === 'OPEN' || j.status === 'Open'));
                    }
                }
            } catch (err) {
                console.error("Profile Load Error:", err);
                // We could set an error state here, but for now just log it
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, token]);

    if (loading) return <div>Loading...</div>;
    if (!candidate) return <div>Candidate not found</div>;

    return (
        <div className="profile-container">
            {/* LEFT COLUMN */}
            <div className="profile-left">

                {/* Candidate Info Card */}
                <div className="card info-card">
                    <div className="card-header-simple">Candidate Info</div>
                    <div className="profile-main-info">
                        <div className="avatar-large">{candidate.name.charAt(0)}</div>
                        <div className="info-text">
                            <h2>{candidate.name}</h2>
                            <p className="email-link">{candidate.email}</p>
                            <p className="phone-text">{candidate.phone}</p>
                            <div className="social-links">
                                <button className="btn-icon-small">in</button>
                                <button className="btn-icon-small">✉</button>
                                <button className="btn-icon-small">Portfolio</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skills & Tags */}
                <div className="card skills-card">
                    <div className="card-header-simple">Skills & Tags</div>
                    <div className="skills-row">
                        {candidate.skills.slice(0, 2).map((skill, i) => (
                            <span key={i} className="skill-pill-large">{skill}</span>
                        ))}
                    </div>
                    <div className="skills-row">
                        {candidate.skills.slice(2).map((skill, i) => (
                            <span key={i} className="skill-pill-large">{skill}</span>
                        ))}
                    </div>
                </div>

                {/* Communication Log */}
                <div className="card comms-card">
                    <div className="card-header-simple">Communication Log</div>
                    <div className="comms-tabs">
                        <button className="tab active">Emails</button>
                        <button className="tab">Notes</button>
                        <button className="tab">Calls</button>
                    </div>
                    <div className="comms-list">
                        <div className="comm-item">
                            <Mail size={16} className="comm-icon" />
                            <div className="comm-content">
                                <span className="comm-label">Email: Sent resume to client.</span>
                            </div>
                        </div>
                        <div className="comm-item">
                            <FileText size={16} className="comm-icon" />
                            <div className="comm-content">
                                <span className="comm-label">Note: Followed up with candidate.</span>
                            </div>
                        </div>
                        <div className="comm-item">
                            <Phone size={16} className="comm-icon" />
                            <div className="comm-content">
                                <span className="comm-label">Call: Spoke with candidate.</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* RIGHT COLUMN */}
            <div className="profile-right">

                {/* Resume Preview */}
                <div className="card resume-card">
                    <div className="card-header-simple">Resume Preview</div>
                    <div className="resume-preview-content">
                        {/* Placeholder visual bars for 'skeleton' look if needed, or just text */}
                        <pre className="resume-text">{candidate.resumeText}</pre>
                    </div>
                </div>

                {/* Job Order Assignment */}
                <div className="card assignment-card">
                    <div className="card-header-simple">Job Order Assignment</div>
                    <div className="assignment-body">
                        <select
                            className="job-select"
                            onChange={(e) => {
                                if (e.target.value) {
                                    // Assign logic
                                    const jobId = e.target.value;
                                    fetch(`${API_BASE_URL}/api/job-orders/${jobId}/candidates/${id}`, {
                                        method: 'POST',
                                        headers: {
                                            'Authorization': token || '',
                                            'X-XSRF-TOKEN': getCsrfToken() || ''
                                        }
                                    })
                                        .then(res => {
                                            if (res.ok) alert('Candidate Assigned to Job!');
                                            else alert('Assignment Failed');
                                        });
                                }
                            }}
                        >
                            <option value="">Select Job Order...</option>
                            {openJobs.map((job: any) => (
                                <option key={job.id} value={job.id}>{job.title} - {job.client?.companyName}</option>
                            ))}
                        </select>
                        <button className="btn-block" onClick={() => alert('Interview Link Generated: https://meet.jit.si/Interview-' + id + '-' + Math.floor(Math.random() * 1000))}>
                            Generate Interview Link
                        </button>
                    </div>
                </div>

                {/* Activity Timeline */}
                <div className="card timeline-card">
                    <div className="card-header-simple">Activity Timeline</div>
                    <div className="timeline-list">
                        <div className="timeline-item">
                            <div className="timeline-icon"><Calendar size={14} /></div>
                            <div className="timeline-content">
                                <span>Interview scheduled</span>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-icon"><FileText size={14} /></div>
                            <div className="timeline-content">
                                <span>Resume uploaded</span>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-icon"><Briefcase size={14} /></div>
                            <div className="timeline-content">
                                <span>Call logged</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
