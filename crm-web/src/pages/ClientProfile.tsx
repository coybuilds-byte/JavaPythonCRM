import { Mail, Phone, MapPin, Plus, UserPlus } from 'lucide-react';
import './ClientProfile.css';

export default function ClientProfile() {
    // const { id } = useParams();
    // content mocked for visual match
    const client = {
        name: 'TechCorp Solutions',
        contact: 'John Doe',
        email: 'johndoe@email.com',
        phone: '(123) 456-7890',
        address: '123 Main St, City, ST 12345',
        jobOrders: [
            { id: 101, title: 'Sales Manager', status: 'Open', positions: 2, date: '2025-01-10' },
            { id: 102, title: 'Software Engineer', status: 'In Progress', positions: 1, date: '2025-01-08' },
        ]
    };

    return (
        <div className="client-profile-container">
            {/* Top Row: Client Info */}
            <div className="card client-info-card">
                <div className="client-logo-placeholder">Logo</div>
                <div className="client-details">
                    <h2>{client.name}</h2>
                    <p className="contact-person">Contact: {client.contact}</p>
                    <div className="contact-row"><Mail size={16}/> {client.email}</div>
                    <div className="contact-row"><Phone size={16}/> {client.phone}</div>
                    <div className="contact-row"><MapPin size={16}/> {client.address}</div>
                </div>
            </div>

            {/* Middle Row: Job Orders & Assignment */}
            <div className="middle-section">
                <div className="card job-orders-card">
                    <div className="card-header">
                        <h3>Job Orders</h3>
                        <button className="btn-small"><Plus size={16}/> Add Job Order</button>
                    </div>
                    <table className="job-table">
                        <thead>
                            <tr>
                                <th>Job Title</th>
                                <th>Status</th>
                                <th>Open Positions</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {client.jobOrders.map(job => (
                                <tr key={job.id}>
                                    <td>{job.title}</td>
                                    <td><span className={`status-pill ${job.status.toLowerCase().replace(' ', '-')}`}>{job.status}</span></td>
                                    <td>{job.positions}</td>
                                    <td>{job.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="card assignment-card">
                    <h3>Candidate Assignment</h3>
                    <div className="assignment-controls">
                        <select className="job-select">
                            <option>Select Job Order...</option>
                            <option>Sales Manager</option>
                        </select>
                        <select className="candidate-select">
                            <option>Select Candidate...</option>
                        </select>
                    </div>
                    <div className="drag-drop-area">
                        <UserPlus size={32} color="#cbd5e1"/>
                        <p>Drag Candidates Here</p>
                    </div>
                    <button className="btn-primary full-width">Assign</button>
                </div>
            </div>

            {/* Bottom Row: Communication & Timeline */}
            <div className="bottom-section">
                <div className="card communication-card">
                    <h3>Communication Log</h3>
                    <div className="comms-tabs">
                        <button className="active">Emails</button>
                        <button>Notes</button>
                    </div>
                    <div className="log-list">
                        <div className="log-item">
                            <Mail size={16} /> 
                            <span>Email Subject - Sent: Today 10:15 AM</span>
                        </div>
                        <div className="log-item">
                            <Mail size={16} /> 
                            <span>Email Subject - Yesterday 2:45 PM</span>
                        </div>
                    </div>
                </div>

                <div className="card timeline-card">
                    <h3>Activity Timeline</h3>
                    <div className="timeline-list">
                        <div className="time-item">
                            <div className="time-dot"></div>
                            <p>Task Completed: Sent proposal document</p>
                        </div>
                        <div className="time-item">
                            <div className="time-dot"></div>
                            <p>Call Logged: Spoke with client</p>
                        </div>
                        <div className="time-item">
                            <div className="time-dot"></div>
                            <p>Meeting Scheduled: Review meeting set for Friday</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
