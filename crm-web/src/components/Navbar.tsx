import { useState } from 'react'; // Added useState
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Briefcase, FileText, Settings, Search, Bell, User, LogOut, ExternalLink, Linkedin, Facebook } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ViewSettingsModal from './ViewSettingsModal';
import NotificationDropdown from './NotificationDropdown';
import BroadcastModal from './BroadcastModal';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showBroadcast, setShowBroadcast] = useState(false);

  const isActive = (path: string) => location.pathname.startsWith(path) ? 'active' : '';

  const handleLogout = () => {
      if(confirm("Are you sure you want to log out?")) {
          logout();
          window.location.href = "/"; // Force redirect
      }
  };

  return (
    <>
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
        <NotificationDropdown onOpenBroadcast={() => setShowBroadcast(true)} />
        
        <div style={{position:'relative'}}>
            <button className="icon-btn" onClick={() => setShowMenu(!showMenu)}><Settings size={20} /></button>
            {showMenu && (
                <div className="dropdown-menu" style={{
                    position:'absolute', top:'100%', right:0, 
                    background:'#1a1f2e', border:'1px solid var(--border)', 
                    padding:'8px', borderRadius:'4px', width:'160px', zIndex:1000
                }}>
                    <div style={{padding:'8px', cursor:'pointer', display:'flex', alignItems:'center', gap:'8px'}} 
                        className="dropdown-item"
                        onClick={() => { setShowSettings(true); setShowMenu(false); }}
                    >
                        <Settings size={14}/> View Settings
                    </div>
                    
                    <div style={{height:'1px', background:'var(--border)', margin:'4px 0'}}></div>
                    
                    <a href="https://www.precisionsourcemanagement.com" target="_blank" rel="noopener noreferrer" className="dropdown-item" style={{padding:'8px', display:'flex', alignItems:'center', gap:'8px', color:'var(--text-primary)', textDecoration:'none'}}>
                        <ExternalLink size={14}/> Website
                    </a>
                    <a href="https://www.linkedin.com/company/precisionsourcemanagement" target="_blank" rel="noopener noreferrer" className="dropdown-item" style={{padding:'8px', display:'flex', alignItems:'center', gap:'8px', color:'var(--text-primary)', textDecoration:'none'}}>
                        <Linkedin size={14}/> LinkedIn
                    </a>
                    <a href="https://www.facebook.com/precisionsourcemanagement" target="_blank" rel="noopener noreferrer" className="dropdown-item" style={{padding:'8px', display:'flex', alignItems:'center', gap:'8px', color:'var(--text-primary)', textDecoration:'none'}}>
                        <Facebook size={14}/> Facebook
                    </a>

                    <div style={{height:'1px', background:'var(--border)', margin:'4px 0'}}></div>

                    <div style={{padding:'8px', cursor:'pointer', display:'flex', alignItems:'center', gap:'8px', color:'#ff6b6b'}} 
                         className="dropdown-item"
                         onClick={handleLogout}
                    >
                        <LogOut size={14}/> Log Out
                    </div>
                </div>
            )}
        </div>

        <div className="user-profile">
            <User size={18} />
            <span>{user || 'User'}</span>
        </div>
      </div>
    </nav>
    {showSettings && <ViewSettingsModal onClose={() => setShowSettings(false)} onSave={() => window.dispatchEvent(new Event('view-prefs-changed'))} />}
    {showBroadcast && <BroadcastModal onClose={() => setShowBroadcast(false)} />}
    </>
  );
}
