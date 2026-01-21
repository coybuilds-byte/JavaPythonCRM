
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CandidateProfile from './pages/CandidateProfile';
import ClientProfile from './pages/ClientProfile';
import Login from './components/Login';
import CandidatesList from './pages/CandidatesList';
import ClientsList from './pages/ClientsList';
import JobOrders from './pages/JobOrders';
import Reports from './pages/Reports';
import './App.css'; 

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
};

// Wrapper specifically for Login to redirect if already authenticated
const LoginRoute = () => {
    const { isAuthenticated, login } = useAuth();
    if (isAuthenticated) return <Navigate to="/dashboard" replace />;
    return <Login onLogin={login} />;
};

function AppContent() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="app-shell">
            {isAuthenticated && <Navbar />}
            <main className="main-content">
                <Routes>
                    <Route path="/login" element={<LoginRoute />} />
                    
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/candidates" element={<ProtectedRoute><CandidatesList /></ProtectedRoute>} />
                    <Route path="/candidates/:id" element={<ProtectedRoute><CandidateProfile /></ProtectedRoute>} />
                    <Route path="/clients" element={<ProtectedRoute><ClientsList /></ProtectedRoute>} />
                    <Route path="/clients/:id" element={<ProtectedRoute><ClientProfile /></ProtectedRoute>} />
                    <Route path="/job-orders" element={<ProtectedRoute><JobOrders /></ProtectedRoute>} />
                    <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                </Routes>
            </main>
        </div>
    );
}

function App() {
  return (
    <Router>
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    </Router>
  );
}

export default App;
