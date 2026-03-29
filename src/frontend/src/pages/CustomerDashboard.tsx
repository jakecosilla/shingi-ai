import { motion } from 'framer-motion';
import { Briefcase, CheckCircle, Clock, Shield, ExternalLink, ChevronRight, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { title: 'Active Cases', value: '3', icon: Briefcase, color: 'var(--accent-color)' },
    { title: 'Approved Results', value: '12', icon: CheckCircle, color: 'var(--success)' },
    { title: 'Awaiting Action', value: '1', icon: Clock, color: 'var(--danger)' },
  ];

  const recentCases = [
    { id: 'C-1024', title: 'Contract Acquisition - Alpha Corp', status: 'IN_REVIEW', date: 'Mar 25', firm: 'Shingi Legal Associates' },
    { id: 'C-1025', title: 'Intellectual Property Filing', status: 'APPROVED', date: 'Mar 24', firm: 'Shingi Legal Associates' },
    { id: 'C-1028', title: 'Estate Review - Legacy Trust', status: 'PENDING', date: 'Mar 22', firm: 'Shingi Legal Associates' },
  ];

  return (
    <div className="customer-dashboard mobile-responsive-container" style={{ padding: '0 0 40px' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="welcome-banner glass-panel"
        style={{
          margin: '0 0 32px',
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(13, 15, 18, 0.8))',
          borderRadius: '24px',
          border: '1px solid var(--glass-border)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', marginBottom: '8px' }}>
              <Shield size={16} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em' }}>SECURE ACCESS ACTIVE</span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.25rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>Hello, {user?.name.split(' ')[0]}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>Welcome to your workspace at Shingi Law Firm.</p>
          </div>
          <div className="hidden-mobile">
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%', background: 'var(--customer-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem'
            }}>
              {user?.name[0]}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards: Responsive Vertical Stacking on Mobile */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="stat-card glass-panel"
            style={{ borderRadius: '20px', padding: '24px', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '80px', height: '80px', background: `${stat.color}05`, borderRadius: '50%' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px', background: `${stat.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color
              }}>
                <stat.icon size={20} />
              </div>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{stat.title}</span>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em' }}>{stat.value}</div>
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--success)' }}>
              <span>Updated 2 hours ago</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="cases-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.01em' }}>Recent Cases</h2>
          <button className="secondary-btn" style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            View All Cases <ChevronRight size={14} />
          </button>
        </div>

        {/* List of Cases: Mobile Friendly Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {recentCases.map((caseItem, i) => (
            <motion.div
              key={caseItem.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className="glass-panel case-row"
              style={{ padding: '20px', borderRadius: '20px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}
            >
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px', background: 'var(--card-bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)'
              }}>
                <FileText size={20} color="var(--accent-color)" />
              </div>

              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', gap: '12px' }}>
                  <span>{caseItem.id}</span>
                  <span>•</span>
                  <span>{caseItem.firm}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '4px' }}>{caseItem.title}</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginLeft: 'auto' }}>
                <div className="hidden-mobile" style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>LAST ACTIVITY</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{caseItem.date}</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '6px 12px',
                    borderRadius: '100px',
                    background: caseItem.status === 'APPROVED' ? 'var(--success)15' : 'var(--accent-color)15',
                    color: caseItem.status === 'APPROVED' ? 'var(--success)' : 'var(--accent-color)',
                    fontWeight: 700,
                    border: `1px solid ${caseItem.status === 'APPROVED' ? 'var(--success)30' : 'var(--accent-color)30'}`
                  }}>
                    {caseItem.status.replace('_', ' ')}
                  </span>
                </div>

                <button 
                  className="icon-btn" 
                  style={{ padding: '8px', color: 'var(--text-secondary)' }}
                  onClick={() => navigate('/chat')}
                >
                  <ExternalLink size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '48px', padding: '32px', borderRadius: '24px', background: 'var(--card-bg)', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '12px' }}>Need assistance with a new matter?</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>Our specialized legal AI agents are available 24/7 to begin your intake process.</p>
        <button 
          className="primary-btn" 
          style={{ margin: '0 auto', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 32px' }}
          onClick={() => navigate('/chat')}
        >
          <Plus size={20} /> Open New Case Workspace
        </button>
      </div>
    </div>
  );
};

const FileText = ({ size, color }: { size: number, color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
);

export default CustomerDashboard;
