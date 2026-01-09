import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Briefcase, FileText } from 'lucide-react';
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
    resumeText: string; // For preview if no file path
}

export default function CandidateProfile() {
    const { id } = useParams();
    const [candidate, setCandidate] = useState<Candidate | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch candidate data
        // For now, using mock data if ID is '1' or similar, else fetch
        const fetchCandidate = async () => {
            try {
                // In real app: const res = await fetch(\`/api/candidates/\${id}\`);
                // const data = await res.json();
                
                // Mock Data matching Image 1
                setCandidate({
                    id: 1,
                    name: 'John Doe',
                    email: 'john.doe@email.com',
                    phone: '555-123-4567',
                    status: 'Active',
                    location: 'New York, NY',
                    currentTitle: 'Senior Software Engineer',
                    skills: ['Java', 'React', 'Spring Boot', 'AWS'],
                    resumeText: 'John Doe\nSenior Software Engineer\n\nExperience:\n- Lead Developer at Tech Co...\n- Senior Engineer at Startup Inc...\n\nEducation:\n- BS Computer Science'
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCandidate();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!candidate) return <div>Candidate not found</div>;

    return (
        <div className="profile-container">
            <div className="profile-left">
                {/* Info Card */}
                <div className="card info-card">
                    <div className="profile-header">
                        <div className="avatar-large">{candidate.name.charAt(0)}</div>
                        <div className="header-text">
                            <h2>{candidate.name}</h2>
                            <p className="title">{candidate.currentTitle}</p>
                            <span className="status-badge">{candidate.status}</span>
                        </div>
                    </div>
                    <div className="contact-details">
                        <div className="detail-row"><Mail size={16} /> {candidate.email}</div>
                        <div className="detail-row"><Phone size={16} /> {candidate.phone}</div>
                        <div className="detail-row"><MapPin size={16} /> {candidate.location}</div>
                    </div>
                </div>

                {/* Skills */}
                <div className="card skills-card">
                    <h3>Skills & Tags</h3>
                    <div className="tags-container">
                        {candidate.skills.map(skill => (
                            <span key={skill} className="skill-tag">{skill}</span>
                        ))}
                    </div>
                </div>

                {/* Communication Log (Placeholder for Activity) */}
                <div className="card comms-card">
                    <h3>Communication Log</h3>
                    <div className="comms-tabs">
                        <button className="active">Emails</button>
                        <button>Notes</button>
                        <button>Calls</button>
                    </div>
                    <div className="log-entries">
                        <div className="log-entry">
                            <Mail size={14} />
                            <div>
                                <p className="log-title">Sent resume to client</p>
                                <span className="log-time">Today 10:15 AM</span>
                            </div>
                        </div>
                        <div className="log-entry">
                            <Phone size={14} />
                            <div>
                                <p className="log-title">Spoke with candidate</p>
                                <span className="log-time">Yesterday 2:00 PM</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="profile-right">
                <div className="card resume-card">
                    <div className="resume-header">
                        <h3>Resume Preview</h3>
                        <div className="resume-actions">
                            <button className="btn-icon"><FileText size={16}/></button>
                        </div>
                    </div>
                    <div className="resume-content">
                        <pre>{candidate.resumeText}</pre>
                    </div>
                </div>
            </div>
        </div>
    );
}
