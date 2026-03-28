import { motion } from 'framer-motion';
import { Briefcase, CheckCircle, Clock } from 'lucide-react';

const CustomerDashboard = () => {
  const stats = [
    { title: 'Active Cases', value: '3', icon: Briefcase, color: 'var(--accent-color)' },
    { title: 'Approved Results', value: '12', icon: CheckCircle, color: 'var(--success)' },
    { title: 'Pending Review', value: '2', icon: Clock, color: 'var(--text-secondary)' },
  ];

  return (
    <div className="customer-dashboard">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="welcome-section"
      >
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px' }}>Hello, Alice</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome to your secure legal portal.</p>
      </motion.div>

      <div className="dashboard-grid mobile-grid-1" style={{ marginTop: '32px' }}>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="stat-card glass-panel"
            style={{ padding: '24px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{stat.title}</span>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '8px', 
                background: `${stat.color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: stat.color
              }}>
                <stat.icon size={18} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: '16px' }}>{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="cases-section" style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px' }}>Recent Cases</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { id: 'C-1024', title: 'Contract Acquisition - Alpha Corp', status: 'IN_REVIEW', date: 'Mar 25' },
            { id: 'C-1025', title: 'Intellectual Property Filing', status: 'APPROVED', date: 'Mar 24' },
          ].map((caseItem, i) => (
            <motion.div
              key={caseItem.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className="glass-panel"
              style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{caseItem.id}</div>
                <div style={{ fontWeight: 500 }}>{caseItem.title}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ 
                  fontSize: '0.75rem', 
                  padding: '4px 10px', 
                  borderRadius: '100px',
                  background: caseItem.status === 'APPROVED' ? 'var(--success)20' : 'var(--accent-color)20',
                  color: caseItem.status === 'APPROVED' ? 'var(--success)' : 'var(--accent-color)',
                  fontWeight: 600
                }}>
                  {caseItem.status}
                </span>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px' }}>{caseItem.date}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
