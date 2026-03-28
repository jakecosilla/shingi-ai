import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Home, MessageSquare, Database, Settings, Activity, Menu, X, LogOut, Briefcase, CheckSquare } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import ApprovedResults from './pages/ApprovedResults';
import LoginPage from './pages/LoginPage';
import Chat from './pages/Chat';
import './App.css';

const Sidebar = ({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) => {
  const location = useLocation();
  const { user, logout, isLawyer, isCustomer } = useAuth();

  const lawyerNav = [
    { path: '/', icon: Home, label: 'Lawyer Dashboard' },
    { path: '/chat', icon: MessageSquare, label: 'Expert AI Counsel' },
    { path: '/data', icon: Database, label: 'Case Files' },
    { path: '/workflows', icon: Activity, label: 'Contract Automation' },
  ];

  const customerNav = [
    { path: '/customer', icon: Home, label: 'Customer Portal' },
    { path: '/customer/cases', icon: Briefcase, label: 'My Cases' },
    { path: '/customer/results', icon: CheckSquare, label: 'Approved Results' },
  ];

  const commonNav = [
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const navItems = isLawyer ? [...lawyerNav, ...commonNav] : [...customerNav, ...commonNav];

  return (
    <>
      {isOpen && (
        <div 
          className="sidebar-overlay show-mobile" 
          onClick={toggle}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90 }}
        />
      )}
      <aside className={`sidebar glass-panel ${isOpen ? 'open' : ''}`}>
        <div className="logo-container" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="logo-icon blur-glow"></div>
            <h2>Shingi AI</h2>
          </div>
          <button className="show-mobile" onClick={toggle}>
            <X size={20} />
          </button>
        </div>
        
        <nav className="nav-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => window.innerWidth < 768 && toggle()}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="user-profile" style={{ cursor: 'pointer', position: 'relative' }}>
          <div className="avatar" style={{ background: isCustomer ? 'var(--customer-accent)' : 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
            {user?.name[0]}
          </div>
          <div className="user-info">
            <h4>{user?.name}</h4>
            <p>{user?.role}</p>
          </div>
          <button onClick={logout} style={{ marginLeft: 'auto', color: 'var(--danger)', opacity: 0.7 }}>
            <LogOut size={16} />
          </button>
        </div>
      </aside>
    </>
  );
};

const Topbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const { user } = useAuth();
  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="show-mobile glass-panel" style={{ padding: '8px' }} onClick={toggleSidebar}>
          <Menu size={20} />
        </button>
        <div className="search-bar hidden-mobile">
          <input type="text" className="input-field" placeholder="Search knowledge base..." />
        </div>
      </div>
      <div className="actions">
        <div className="hidden-mobile" style={{ marginRight: '12px', textAlign: 'right' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.firm || 'Client Access'}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Secure Portal</div>
        </div>
        <button className="secondary-btn notification-btn">
          <span className="badge"></span>
          🔔
        </button>
      </div>
    </header>
  );
};

const LoginGate = () => {
  const { user } = useAuth();
  if (user) return null;
  return <LoginPage />;
};

const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role: 'LAWYER' | 'CUSTOMER' }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  if (user.role !== role) return <Navigate to={user.role === 'LAWYER' ? '/' : '/customer'} />;
  return children;
};

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="app-container">
      <LoginGate />
      {user && (
        <>
          <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} />
          <main className="main-content">
            <Topbar toggleSidebar={() => setIsSidebarOpen(true)} />
            <div className="page-wrapper">
              <Routes>
                {/* Lawyer Routes */}
                <Route path="/" element={
                  <ProtectedRoute role="LAWYER">
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/chat/*" element={
                  <ProtectedRoute role="LAWYER">
                    <Chat />
                  </ProtectedRoute>
                } />

                {/* Customer Routes */}
                <Route path="/customer" element={
                  <ProtectedRoute role="CUSTOMER">
                    <CustomerDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/customer/cases" element={
                  <ProtectedRoute role="CUSTOMER">
                    <CustomerDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/customer/results" element={
                  <ProtectedRoute role="CUSTOMER">
                    <ApprovedResults />
                  </ProtectedRoute>
                } />

                <Route path="/settings" element={<div className="glass-panel" style={{padding: '2rem'}}><h2>Settings</h2><p>Configuration panel coming soon...</p></div>} />
              </Routes>
            </div>
          </main>
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
