import { motion } from 'framer-motion';
import { FileCheck, Download, ExternalLink } from 'lucide-react';

const ApprovedResults = () => {
  const approvedItems = [
    { title: 'Alpha Corp Master Service Agreement', id: 'DOC-9923', type: 'Contract Review', lawyer: 'Jake Rayosilla', date: 'Mar 24, 2026' },
    { title: 'Intellectual Property Filing Strategy', id: 'DOC-9924', type: 'Strategy Document', lawyer: 'Sarah Smith', date: 'Mar 22, 2026' },
  ];

  return (
    <div className="approved-results">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="header-section"
        style={{ marginBottom: '32px' }}
      >
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px' }}>Approved Results</h1>
        <p style={{ color: 'var(--text-secondary)' }}>These results have been reviewed and approved by your legal counsel.</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }} className="mobile-grid-1">
        {approvedItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel"
            style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '60px', height: '60px', borderRadius: '50%', background: 'var(--success)10', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileCheck size={24} color="var(--success)" style={{ transform: 'translateX(-5px) translateY(5px)' }}/>
            </div>
            
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--success)', marginBottom: '8px' }}>APPROVED BY {item.lawyer.toUpperCase()}</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px', width: '85%' }}>{item.title}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Case ID</span>
                <span style={{ fontWeight: 500 }}>{item.id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Type</span>
                <span style={{ fontWeight: 500 }}>{item.type}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Approved On</span>
                <span style={{ fontWeight: 500 }}>{item.date}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="primary-btn" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--success)' }}>
                <Download size={16} /> <span>Download</span>
              </button>
              <button className="secondary-btn" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <ExternalLink size={16} /> <span>View</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ApprovedResults;
