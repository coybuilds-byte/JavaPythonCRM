import './Dashboard.css';
import { Users, Briefcase, Calendar, TrendingUp } from 'lucide-react';

export default function Dashboard() {
    return (
        <div className="dashboard-container">
            <header className="page-header">
                <h1>Dashboard</h1>
                <p>Welcome back, Jesse</p>
            </header>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon candidate"><Users /></div>
                    <div className="stat-info">
                        <span className="stat-label">Active Candidates</span>
                        <span className="stat-value">128</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon job"><Briefcase /></div>
                    <div className="stat-info">
                        <span className="stat-label">Open Job Orders</span>
                        <span className="stat-value">34</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon interview"><Calendar /></div>
                    <div className="stat-info">
                        <span className="stat-label">Interviews Scheduled</span>
                        <span className="stat-value">12</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon revenue"><TrendingUp /></div>
                    <div className="stat-info">
                        <span className="stat-label">Placements This Month</span>
                        <span className="stat-value">8</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="activity-feed card">
                    <h3>Activity Feed</h3>
                    <ul className="feed-list">
                        <li>
                            <span className="bullet"></span>
                            <div className="feed-text">
                                <strong>Jane Smith</strong> had an interview with <strong>Client A</strong>.
                                <span className="time">2 hours ago</span>
                            </div>
                        </li>
                        <li>
                            <span className="bullet"></span>
                            <div className="feed-text">
                                New job order added: <strong>Sales Manager</strong>
                                <span className="time">4 hours ago</span>
                            </div>
                        </li>
                        <li>
                            <span className="bullet"></span>
                            <div className="feed-text">
                                <strong>Mike Johnson</strong> updated candidate profile.
                                <span className="time">Yesterday</span>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="tasks-section card">
                    <h3>Today's Tasks</h3>
                    <div className="empty-state">No pending tasks</div>
                </div>
            </div>
        </div>
    );
}
