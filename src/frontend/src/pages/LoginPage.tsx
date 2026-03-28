import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Mail, ArrowRight } from 'lucide-react';

const LoginPage = () => {
    const { login, register, isLoading, error } = useAuth();
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [selectedRole, setSelectedRole] = useState<'LAWYER' | 'CUSTOMER'>('LAWYER');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isRegistering) {
                await register(email, password, fullName);
                setIsRegistering(false);
                alert('Registration successful! Please login.');
            } else {
                await login(email, password, selectedRole);
            }
        } catch (err) {
            // Error is handled by context
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-gradient)'
        }}>
            <div className="glass-panel" style={{ padding: '40px', maxWidth: '440px', width: '90%' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div className="logo-icon blur-glow" style={{ margin: '0 auto 24px' }}></div>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>Shingi AI Portal</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {isRegistering ? 'Create your enterprise account' : 'Welcome to secure legal intelligence'}
                    </p>
                </div>

                {error && (
                    <div style={{
                        padding: '12px', background: 'var(--danger)20', border: '1px solid var(--danger)40',
                        color: 'var(--danger)', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {isRegistering && (
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type="text" className="input-field" placeholder="Full Name" style={{ paddingLeft: '48px' }}
                                value={fullName} onChange={e => setFullName(e.target.value)} required
                            />
                        </div>
                    )}

                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                            type="email" className="input-field" placeholder="Organization Email" style={{ paddingLeft: '48px' }}
                            value={email} onChange={e => setEmail(e.target.value)} required
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                            type="password" className="input-field" placeholder="Password" style={{ paddingLeft: '48px' }}
                            value={password} onChange={e => setPassword(e.target.value)} required
                        />
                    </div>

                    {!isRegistering && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                type="button"
                                className={selectedRole === 'LAWYER' ? 'primary-btn' : 'secondary-btn'}
                                style={{ flex: 1, fontSize: '0.85rem' }}
                                onClick={() => setSelectedRole('LAWYER')}
                            >
                                Lawyer
                            </button>
                            <button
                                type="button"
                                className={selectedRole === 'CUSTOMER' ? 'primary-btn' : 'secondary-btn'}
                                style={{ flex: 1, fontSize: '0.85rem' }}
                                onClick={() => setSelectedRole('CUSTOMER')}
                            >
                                Customer
                            </button>
                        </div>
                    )}

                    <button
                        type="submit" className="primary-btn"
                        disabled={isLoading}
                        style={{ padding: '14px', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                        {isLoading ? 'Processing...' : (isRegistering ? 'Establish Profile' : 'Access Portal')}
                        <ArrowRight size={18} />
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <button
                        className="secondary-btn"
                        style={{ border: 'none', background: 'none', color: 'var(--accent-color)' }}
                        onClick={() => setIsRegistering(!isRegistering)}
                    >
                        {isRegistering ? 'Already have an account? Login' : 'New to Shingi AI? Register'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
