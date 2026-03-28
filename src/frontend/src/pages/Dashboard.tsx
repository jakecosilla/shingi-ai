import { Users, Zap, ArrowUpRight, Activity } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  trend: string;
  icon: LucideIcon;
  delay: number;
}

const StatCard = ({ title, value, trend, icon: Icon, delay }: StatCardProps) => (
  <motion.div 
    className="stat-card glass-panel"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
  >
    <div className="stat-header">
      <span style={{ fontWeight: 500 }}>{title}</span>
      <div className="stat-icon">
        <Icon size={20} />
      </div>
    </div>
    <div>
      <div className="stat-value">{value}</div>
      <div className="stat-trend" style={{ marginTop: '8px' }}>
        <ArrowUpRight size={16} />
        <span>{trend}</span>
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  return (
    <div style={{ padding: '0 0' }}>
      <motion.h1 
        style={{ marginBottom: '32px', fontSize: '2rem', fontWeight: 600 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        Lawyer Dashboard
      </motion.h1>
      
      <div className="dashboard-grid">
        <StatCard title="Active Cases" value="28" trend="+2 this week" icon={Activity} delay={0.1} />
        <StatCard title="Documents Analyzed" value="1,245" trend="+18% vs last month" icon={Users} delay={0.2} />
        <StatCard title="Billable Hours Saved" value="142" trend="+15hrs optimization" icon={Zap} delay={0.3} />
      </div>

      <div className="chart-section">
        <motion.div 
          className="chart-card glass-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h3 className="card-title">Token Usage Analytics</h3>
          <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            [Interactive Chart Component Placeholder]
          </div>
        </motion.div>
        
        <motion.div 
          className="chart-card glass-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h3 className="card-title">System Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }}></div>
              <span>Vector Database - Online</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }}></div>
              <span>LLM Gateway - Online</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }}></div>
              <span>Embedding Engine - Online</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
