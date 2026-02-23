```javascript
import { useState, useEffect } from 'react';
import { Search, Users, Briefcase, FileText, Activity, Clock, Plus, ArrowUpRight, TrendingUp, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import './Dashboard.css';

export default function Dashboard() {
    const { token } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${ API_BASE_URL } /api/dashboard`, {
                    headers: { 'Authorization': token || '' }
                });
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                } else {
                    console.error("Failed to fetch dashboard stats:", res.status, res.statusText);
                    // Initialize with default values if fetch fails
                    setStats({
                        activeCandidates: 0,
                        openJobOrders: 0,
                        interviewsScheduled: 0,
                        recentCandidates: [],
                        recentJobs: []
                    });
                }
            } catch (error) {
                console.error("Error loading dashboard stats", error);
                // Initialize with default values on network error
                setStats({
                    activeCandidates: 0,
                    openJobOrders: 0,
                    interviewsScheduled: 0,
                    recentCandidates: [],
                    recentJobs: []
                });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Merge recent items for Activity Feed (Sort by ID/Date desc approximation)
    const activities = [
        ...stats.recentCandidates.map((c: any) => ({ type: 'candidate', date: c.id, text: `New candidate added: ${ c.name } (${ c.currentTitle || 'No Title' })` })),
        ...stats.recentJobs.map((j: any) => ({ type: 'job', date: j.id, text: `New Job Order: ${ j.title } for ${ j.client?.companyName || 'Unknown Client' }` }))
    ].sort((a, b) => b.date - a.date).slice(0, 10);

    if (loading) return <div className="page-container">Loading Dashboard...</div>;

    return (
        <div className="dashboard-container">
            {/* Top Row: KPI Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">Active Candidates</div>
                    <div className="stat-value">{stats.activeCandidates}</div>
                    <div className="stat-change positive">
                        <Users size={16} />
                        <span>Total Database</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">Open Job Orders</div>
                    <div className="stat-value">{stats.openJobOrders}</div>
                    <div className="stat-change positive">
                        <Briefcase size={16} />
                        <span>Currently Hiring</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">Interviews Scheduled</div>
                    <div className="stat-value">{stats.interviewsScheduled}</div>
                    <div className="stat-change neutral">
                        <Calendar size={16} />
                        <span>Active Interviews</span>
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
                            <h3>Recent Candidates</h3>
                        </div>
                        <div className="search-bar">
                             {/* Placeholder search logic could go here */}
                             <div style={{color:'gray', fontSize:'0.9em'}}>Latest 5 entries</div>
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
                                {stats.recentCandidates.map((c: any) => (
                                    <tr key={c.id}>
                                        <td>{c.name}</td>
                                        <td>{c.currentTitle}</td>
                                        <td><span className={`status - pill ${ c.status ? c.status.toLowerCase() : 'new' } `}>{c.status || 'New'}</span></td>
                                        <td>{c.location || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="section-footer">
                             <a href="/candidates" className="btn-text">View All</a>
                        </div>
                    </div>

                    {/* Client Management */}
                    <div className="section-card card">
                        <div className="section-header">
                            <h3>Recent Job Orders</h3>
                            <a href="/job-orders" className="btn-small">View All</a>
                        </div>
                        <table className="mini-table">
                            <thead>
                                <tr>
                                    <th>Job Title</th>
                                    <th>Status</th>
                                    <th>Positions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentJobs.map((j: any) => (
                                    <tr key={j.id}>
                                        <td>{j.title}</td>
                                        <td><span className={`status - pill ${ j.status ? j.status.toLowerCase() : 'open' } `}>{j.status}</span></td>
                                        <td>{j.openPositions || 1}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>

                {/* Right Column: Activity Feed */}
                <div className="activity-column">
                    <div className="activity-card card">
                        <h3>Activity Feed</h3>
                        <ul className="feed-list">
                            {activities.map((act, i) => (
                                <li key={i}>
                                    <span className="bullet">■</span>
                                    <div className="feed-text">
                                        {act.text}
                                    </div>
                                </li>
                            ))}
                            {activities.length === 0 && <li style={{color:'gray'}}>No recent activity.</li>}
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
