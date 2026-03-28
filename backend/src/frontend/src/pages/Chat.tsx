import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, Server } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const agents = [
  { id: 1, name: 'Knowledge Bot', role: 'Enterprise Q&A', icon: Bot },
  { id: 2, name: 'Code Assistant', role: 'Architecture & Review', icon: Server },
  { id: 3, name: 'Data Analyst', role: 'Metrics & Visualization', icon: Sparkles },
];

const Chat = () => {
  const [activeAgent, setActiveAgent] = useState(agents[0]);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I am connected to the Shingi AI semantic knowledge base. How can I assist your enterprise today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages([...messages, newMsg]);
    setInput('');
    
    // Simulate thinking/typing delay
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: `Based on the latest RAG embeddings and my specialized tools as ${activeAgent.name}, I'm processing your request. In a full implementation, I would retrieve the relevant enterprise data...`,
        sender: 'bot'
      }]);
    }, 1500);
  };

  return (
    <div className="chat-layout glass-panel" style={{ overflow: 'hidden' }}>
      <div className="agent-list glass-panel" style={{ border: 'none', borderRadius: 0, borderRight: '1px solid var(--glass-border)' }}>
        <h3 style={{ marginBottom: '24px', fontSize: '1rem', fontWeight: 600 }}>Active Assistants</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {agents.map(agent => {
            const Icon = agent.icon;
            return (
              <div 
                key={agent.id} 
                className={`agent-item ${activeAgent.id === agent.id ? 'active' : ''}`}
                onClick={() => setActiveAgent(agent)}
              >
                <div style={{ 
                  background: activeAgent.id === agent.id ? 'var(--accent-color)' : 'var(--card-bg)', 
                  padding: '10px', 
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={18} color={activeAgent.id === agent.id ? '#fff' : 'var(--text-secondary)'} />
                </div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{agent.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{agent.role}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="chat-panel">
        <div className="chat-messages">
          <AnimatePresence>
            {messages.map(msg => (
              <motion.div 
                key={msg.id} 
                className={`message ${msg.sender}`}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="avatar" style={{ 
                  width: '36px', height: '36px', 
                  background: msg.sender === 'user' ? 'linear-gradient(135deg, #10b981, #14b8a6)' : 'var(--card-bg)',
                  border: msg.sender === 'bot' ? '1px solid var(--glass-border)' : 'none'
                }}>
                  {msg.sender === 'user' ? <User size={18} /> : <Bot size={18} color="var(--accent-color)" />}
                </div>
                <div className="message-bubble">
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        <div className="chat-input-area">
          <input 
            type="text" 
            className="input-field chat-input" 
            placeholder={`Message ${activeAgent.name}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="primary-btn send-btn" onClick={handleSend}>
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
