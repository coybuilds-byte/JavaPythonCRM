import { useState, useEffect } from 'react';
import { Users, Briefcase, Calendar, TrendingUp, Search, Bell } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
    const [stats, setStats] = useState({
        activeCandidates: 0,
        openJobs: 0,
        interviews: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [candidatesRes, jobsRes] = await Promise.all([
                    fetch('/api/candidates'),
                    fetch('/api/job-orders')
                ]);
                
                if (candidatesRes.ok && jobsRes.ok) {
                   const candidates = await candidatesRes.json();
                   const jobs = await jobsRes.json();
                   
                   // Calculate Stats
                   const activeCandidates = candidates.length; // Simply count all for now, or filter by status
                   const openJobs = jobs.filter((j: any) => j.status === 'Open').length;
                   // Mock interviews count logic or derive from status
                   const interviewing = jobs.filter((j: any) => j.status === 'Interviewing').length;

                   setStats({
                       activeCandidates,
                       openJobs,
                       interviews: interviewing
                   });
                }
            } catch (error) {
                console.error("Error loading dashboard stats", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="dashboard-container">
            {/* Top Row: KPI Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">Active Candidates</div>
                    <div className="stat-value">{stats.activeCandidates}</div>
                    <div className="stat-change positive">
                        <Users size={16} />
                        <span>+12% vs last month</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">Open Job Orders</div>
                    <div className="stat-value">{stats.openJobs}</div>
                    <div className="stat-change positive">
                        <Briefcase size={16} />
                        <span>+5 new this week</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">Interviews Scheduled</div>
                    <div className="stat-value">{stats.interviews}</div>
                    <div className="stat-change neutral">
                        <Calendar size={16} />
                        <span>Same as yesterday</span>
                    </div>
                </div>
            </div>

            {/* Middle Section: Main Content Grid */}
            <div className="main-grid">
                
                {/* Left Column: Management Tables */}
                <div className="management-column">
                    
                    {/* Candidate Management */}
                    <div className="section-card card">
                        <div className="section-header">
                            <h3>Candidate Management</h3>
                        </div>
                        <div className="search-bar">
                            <Search size={16} className="search-icon" />
                            <input type="text" placeholder="Search Candidates" />
                        </div>
                        <table className="mini-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Position</th>
                                    <th>Status</th>
                                    <th>Location</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>John Doe</td>
                                    <td>Marketing Specialist</td>
                                    <td><span className="status-pill active">Active</span></td>
                                    <td>New York</td>
                                </tr>
                                <tr>
                                    <td>Jane Smith</td>
                                    <td>Sales Planner</td>
                                    <td><span className="status-pill active">Active</span></td>
                                    <td>New York</td>
                                </tr>
                                <tr>
                                    <td>Mike Johnson</td>
                                    <td>Marketing Spg</td>
                                    <td><span className="status-pill active">Active</span></td>
                                    <td>San Fronds</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="section-footer">
                             <button className="btn-text">View All</button>
                        </div>
                    </div>

                    {/* Client Management */}
                    <div className="section-card card">
                        <div className="section-header">
                            <h3>Client Management</h3>
                            <button className="btn-small">Add Job Order</button>
                        </div>
                        <div className="search-bar">
                             <Search size={16} className="search-icon" />
                            <input type="text" placeholder="Client Job Orders" />
                        </div>
                        <table className="mini-table">
                            <thead>
                                <tr>
                                    <th>Job Title</th>
                                    <th>Status</th>
                                    <th>Location</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Sales Manager</td>
                                    <td><span className="status-pill open">Open</span></td>
                                    <td>New Angeles</td>
                                </tr>
                                <tr>
                                    <td>Software Engineer</td>
                                    <td><span className="status-pill in-progress">In Progress</span></td>
                                    <td>Chicago</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>

                {/* Right Column: Activity Feed */}
                <div className="activity-column">
                    <div className="activity-card card">
                        <h3>Activity Feed</h3>
                        <ul className="feed-list">
                            <li>
                                <span className="bullet">■</span>
                                <div className="feed-text">
                                    <strong>Jane Smith</strong> had an interview with <strong>Client A</strong>.
                                </div>
                            </li>
                            <li>
                                <span className="bullet">■</span>
                                <div className="feed-text">
                                    New job order added: <strong>Sales Manager</strong>
                                </div>
                            </li>
                            <li>
                                <span className="bullet">■</span>
                                <div className="feed-text">
                                    <strong>Mike Johnson</strong> updated candidate profile.
                                </div>
                            </li>
                            <li>
                                <span className="bullet">■</span>
                                <div className="feed-text">
                                    Meeting scheduled with <strong>Client B</strong>.
                                </div>
                            </li>
                             <li>
                                <span className="bullet">■</span>
                                <div className="feed-text">
                                    <strong>Sarah Lee</strong> submitted a resume.
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Analytics */}
            <div className="analytics-section card">
                <h3>Analytics</h3>
                <div className="analytics-grid">
                    <div className="chart-placeholder">
                        <h4>Placements This Month</h4>
                        <div className="bar-chart-mock">
                             <div className="bar" style={{height: '40%'}}></div>
                             <div className="bar" style={{height: '60%'}}></div>
                             <div className="bar" style={{height: '80%'}}></div>
                             <div className="bar" style={{height: '30%'}}></div>
                             <div className="bar" style={{height: '50%'}}></div>
                             <div className="bar" style={{height: '70%'}}></div>
                             <div className="bar" style={{height: '90%'}}></div>
                        </div>
                    </div>
                    <div className="chart-placeholder">
                         <h4>Pipeline Overview</h4>
                         <div className="line-chart-mock">
                            {/* Graphic handled by CSS or SVG later - placeholder for now */}
                            <svg viewBox="0 0 100 30" className="line-chart-svg">
                                <polyline points="0,30 20,20 40,25 60,10 80,15 100,5" fill="none" stroke="var(--primary)" strokeWidth="2" />
                            </svg>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
