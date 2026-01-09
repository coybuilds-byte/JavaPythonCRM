import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Briefcase, FileText, Settings, Search, Bell, User } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path) ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">
             <img src="/logo.jpg" alt="PSM Logo" className="navbar-logo-img" />
        </Link>
      </div>
      
      <div className="navbar-links">
        <Link to="/dashboard" className={`nav-item ${isActive('/dashboard')}`}>
          <Home size={18} /> Dashboard
        </Link>
        <Link to="/candidates" className={`nav-item ${isActive('/candidates')}`}>
          <Users size={18} /> Candidates
        </Link>
        <Link to="/clients" className={`nav-item ${isActive('/clients')}`}>
          <Briefcase size={18} /> Clients
        </Link>
        <Link to="/job-orders" className={`nav-item ${isActive('/job-orders')}`}>
          <FileText size={18} /> Job Orders
        </Link>
      </div>

      <div className="navbar-actions">
        <div className="search-bar">
            <Search size={16} />
            <input type="text" placeholder="Search..." />
        </div>
        <button className="icon-btn"><Bell size={20} /></button>
        <button className="icon-btn"><Settings size={20} /></button>
        <div className="user-profile">
            <User size={18} />
            <span>Jesse</span>
        </div>
      </div>
    </nav>
  );
}
