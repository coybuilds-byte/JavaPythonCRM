import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CandidateProfile from './pages/CandidateProfile';
import ClientProfile from './pages/ClientProfile';
import Login from './components/Login';
// import CandidateUpload from './components/CandidateUpload';
import './App.css'; 

// Placeholder pages
import CandidatesList from './pages/CandidatesList';
import ClientsList from './pages/ClientsList';

const JobOrders = () => <div className="p-8"><h2>Job Orders Page (Coming Soon)</h2></div>;

function App() {
  // Temporary Auth Check (Should be context)
  const isAuthenticated = true; 

  return (
    <Router>
      <div className="app-shell">
        {isAuthenticated && <Navbar />}
        <main className="main-content">
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/login" element={<Login onLogin={() => {}} />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/candidates" element={<CandidatesList />} />
                <Route path="/candidates/:id" element={<CandidateProfile />} />
                <Route path="/clients" element={<ClientsList />} />
                <Route path="/clients/:id" element={<ClientProfile />} />
                <Route path="/job-orders" element={<JobOrders />} />
            </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
