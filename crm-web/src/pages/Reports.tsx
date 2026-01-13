import { BarChart2, TrendingUp } from 'lucide-react';
import './Reports.css';

export default function Reports() {
    return (
        <div className="page-container">
            <div className="page-header-row">
                <h1>Reports & Analytics</h1>
            </div>

            <div className="reports-grid">
                <div className="report-card card">
                    <div className="card-header">
                        <h3>Placements by Month</h3>
                        <BarChart2 size={20} color="var(--primary-light)" />
                    </div>
                    <div className="chart-placeholder">
                        <div className="bar" style={{height: '40%'}}></div>
                        <div className="bar" style={{height: '60%'}}></div>
                        <div className="bar" style={{height: '30%'}}></div>
                        <div className="bar" style={{height: '80%'}}></div>
                        <div className="bar active" style={{height: '90%'}}></div>
                        <div className="bar" style={{height: '50%'}}></div>
                    </div>
                    <div className="chart-labels">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                    </div>
                </div>

                <div className="report-card card">
                    <div className="card-header">
                        <h3>Pipeline Health</h3>
                        <TrendingUp size={20} color="var(--accent)" />
                    </div>
                     <div className="pipeline-stats">
                        <div className="pipeline-item">
                            <span className="label">New Leads</span>
                            <div className="progress-bg"><div className="progress-fill" style={{width: '80%', background: '#3b82f6'}}></div></div>
                            <span className="value">42</span>
                        </div>
                        <div className="pipeline-item">
                            <span className="label">Interviews</span>
                            <div className="progress-bg"><div className="progress-fill" style={{width: '45%', background: '#f59e0b'}}></div></div>
                            <span className="value">18</span>
                        </div>
                        <div className="pipeline-item">
                            <span className="label">Offers</span>
                            <div className="progress-bg"><div className="progress-fill" style={{width: '20%', background: '#10b981'}}></div></div>
                            <span className="value">6</span>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
}
