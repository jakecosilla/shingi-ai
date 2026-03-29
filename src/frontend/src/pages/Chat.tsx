import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Paperclip, Plus, MessageCircle, FileText, Image as ImageIcon, X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  attachments?: { name: string, type: 'file' | 'image' }[];
}

interface Case {
  id: string;
  title: string;
  description: string;
  messages: Message[];
  status: 'ACTIVE' | 'PENDING' | 'RESOLVED';
}

const Chat = () => {
  // Use localStorage to persist cases
  const [cases, setCases] = useState<Case[]>(() => {
    const saved = localStorage.getItem('shingi_cases');
    if (saved) return JSON.parse(saved);
    return [{
      id: 'C-001',
      title: 'Initial Consultation',
      description: 'New case inquiry',
      status: 'ACTIVE',
      messages: [{ 
        id: 1, 
        text: "Hello! I am connected to the firm's secure legal knowledge base. How can I assist with your caseload today?", 
        sender: 'bot',
        timestamp: new Date()
      }]
    }];
  });

  const [activeCaseId, setActiveCaseId] = useState<string>(cases[0].id);
  const [input, setInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showCaseList, setShowCaseList] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeCase = cases.find(c => c.id === activeCaseId) || cases[0];

  useEffect(() => {
    localStorage.setItem('shingi_cases', JSON.stringify(cases));
  }, [cases]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeCase.messages]);

  const createNewCase = () => {
    const newCase: Case = {
      id: `C-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      title: 'New Investigation',
      description: 'Evidence gathering & analysis',
      status: 'ACTIVE',
      messages: [{
        id: Date.now(),
        text: "New secure workspace initialized. Please upload documents or describe the case details to begin.",
        sender: 'bot',
        timestamp: new Date()
      }]
    };
    setCases([newCase, ...cases]);
    setActiveCaseId(newCase.id);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: Message = { 
      id: Date.now(), 
      text: input, 
      sender: 'user',
      timestamp: new Date()
    };
    
    const updatedCases = cases.map(c => 
      c.id === activeCaseId 
        ? { ...c, messages: [...c.messages, userMsg] }
        : c
    );
    
    setCases(updatedCases);
    setInput('');
    
    // Real AI Agent reasoning via backend (Ollama)
    try {
      const authData = JSON.parse(localStorage.getItem('shingi_user') || '{}');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5076'}/ai/ask`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData.token}`
        },
        body: JSON.stringify({ question: input }),
      });

      if (!response.ok) throw new Error('AI analysis failed');
      
      const data = await response.json();
      
      const botResponse: Message = {
        id: Date.now() + 1,
        text: data.answer || data.response || "Analysis complete. Please let me know if you need specific details extracted.",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setCases(prev => prev.map(c => 
        c.id === activeCaseId 
          ? { ...c, messages: [...c.messages, botResponse] }
          : c
      ));
    } catch (err) {
      console.error("Chat Error:", err);
      const errorResponse: Message = {
        id: Date.now() + 1,
        text: "I encountered an error connecting to the secure reasoning cluster. Please ensure your session is active or contact IT.",
        sender: 'bot',
        timestamp: new Date()
      };
      setCases(prev => prev.map(c => 
        c.id === activeCaseId 
          ? { ...c, messages: [...c.messages, errorResponse] }
          : c
      ));
    }
  };

  return (
    <div className={`chat-layout glass-panel ${showCaseList ? 'show-sidebar' : ''}`} style={{ overflow: 'hidden', height: 'calc(100vh - 140px)' }}>
      {/* Sidebar: Case Navigation */}
      <div className="agent-list chat-sidebar" style={{ 
        width: '320px', 
        borderRight: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Active Cases</h3>
          <button className="primary-btn" style={{ padding: '8px' }} onClick={createNewCase}>
            <Plus size={18} />
          </button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {cases.map(c => (
            <div 
              key={c.id} 
              className={`agent-item ${activeCaseId === c.id ? 'active' : ''}`}
              onClick={() => {
                setActiveCaseId(c.id);
                setShowCaseList(false);
              }}
              style={{ padding: '12px' }}
            >
              <div style={{ 
                background: activeCaseId === c.id ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)', 
                padding: '10px', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MessageCircle size={18} color={activeCaseId === c.id ? '#fff' : 'var(--text-secondary)'} />
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{c.id}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {c.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Main Chat Panel */}
      <div className="chat-panel">
        {/* Chat Header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            className="show-mobile secondary-btn" 
            style={{ padding: '8px', marginRight: '8px' }}
            onClick={() => setShowCaseList(true)}
          >
            <Menu size={18} />
          </button>
          <div className="logo-icon" style={{ background: 'var(--accent-color)20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <Bot size={18} color="var(--accent-color)" />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Case: {activeCase.id}</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Knowledge Base Connected</p>
          </div>
        </div>

        <div className="chat-messages" style={{ paddingBottom: '100px' }}>
          <AnimatePresence>
            {activeCase.messages.map(msg => (
              <motion.div 
                key={msg.id} 
                className={`message ${msg.sender === 'user' ? 'user' : 'bot'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="avatar" style={{ 
                  background: msg.sender === 'user' ? 'var(--accent-color)' : 'var(--card-bg)',
                  border: '1px solid var(--glass-border)'
                }}>
                  {msg.sender === 'user' ? <User size={18} color="#fff" /> : <Bot size={18} color="var(--accent-color)" />}
                </div>
                <div className="message-bubble" style={{ fontSize: '0.9rem' }}>
                  {msg.text}
                  <div style={{ fontSize: '0.65rem', opacity: 0.5, marginTop: '8px', textAlign: 'right' }}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
        
        {/* Upload Modal Overlay */}
        <AnimatePresence>
          {isUploading && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
            >
              <motion.div 
                initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                className="glass-panel" 
                style={{ width: '100%', maxWidth: '400px', padding: '32px', textAlign: 'center' }}
              >
                <button 
                   onClick={() => setIsUploading(false)}
                   style={{ position: 'absolute', right: '16px', top: '16px', color: 'var(--text-secondary)' }}
                >
                  <X size={20} />
                </button>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '16px' }}>
                   <div style={{ cursor: 'pointer', padding: '20px', borderRadius: '16px', border: '1px dashed var(--glass-border)', flex: 1 }}>
                      <FileText size={32} color="var(--accent-color)" style={{ margin: '0 auto 12px' }} />
                      <span style={{ fontSize: '0.8rem' }}>Upload Document</span>
                   </div>
                   <div style={{ cursor: 'pointer', padding: '20px', borderRadius: '16px', border: '1px dashed var(--glass-border)', flex: 1 }}>
                      <ImageIcon size={32} color="var(--success)" style={{ margin: '0 auto 12px' }} />
                      <span style={{ fontSize: '0.8rem' }}>Upload Image</span>
                   </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Improved Input Area */}
        <div className="chat-input-area" style={{ position: 'sticky', bottom: 0, background: 'rgba(13, 15, 18, 0.8)', backdropFilter: 'blur(10px)', padding: '20px 24px' }}>
          <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
            <button 
               className="secondary-btn" 
               style={{ width: '48px', height: '48px', padding: 0, border: '1px solid var(--glass-border)' }}
               onClick={() => setIsUploading(true)}
            >
              <Paperclip size={20} color="var(--text-secondary)" />
            </button>
            <input 
              type="text" 
              className="input-field chat-input" 
              placeholder={`Collaborate on ${activeCase.id}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              style={{ border: '1px solid var(--glass-border)' }}
            />
            <button className="primary-btn send-btn" onClick={handleSend} style={{ boxShadow: '0 4px 15px var(--accent-color)40' }}>
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
