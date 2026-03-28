import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, MessageSquare, Database, Settings, Activity } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import './App.css';

const Sidebar = () => {
  const location = useLocation();
  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/chat', icon: MessageSquare, label: 'AI Assistants' },
    { path: '/data', icon: Database, label: 'Knowledge Base' },
    { path: '/workflows', icon: Activity, label: 'Workflows' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="sidebar glass-panel">
      <div className="logo-container">
        <div className="logo-icon blur-glow"></div>
        <h2>Shingi AI</h2>
      </div>
      <nav className="nav-menu">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link key={item.path} to={item.path} className={`nav-item ${isActive ? 'active' : ''}`}>
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="user-profile">
        <div className="avatar">U</div>
        <div className="user-info">
          <h4>Admin User</h4>
          <p>Enterprise Plan</p>
        </div>
      </div>
    </aside>
  );
};

const Topbar = () => {
  return (
    <header className="topbar">
      <div className="search-bar">
        <input type="text" className="input-field" placeholder="Search knowledge base, workflows..." />
      </div>
      <div className="actions">
        <button className="secondary-btn notification-btn">
          <span className="badge"></span>
          🔔
        </button>
      </div>
    </header>
  );
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Topbar />
          <div className="page-wrapper">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/chat/*" element={<Chat />} />
              <Route path="/data" element={<div className="glass-panel" style={{padding: '2rem'}}><h2>Knowledge Base</h2><p>Data orchestration interface coming soon...</p></div>} />
              <Route path="/workflows" element={<div className="glass-panel" style={{padding: '2rem'}}><h2>Workflows</h2><p>LangGraph workflow visualization coming soon...</p></div>} />
              <Route path="/settings" element={<div className="glass-panel" style={{padding: '2rem'}}><h2>Settings</h2><p>Configuration panel coming soon...</p></div>} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
