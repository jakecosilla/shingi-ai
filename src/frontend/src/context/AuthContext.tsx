import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type UserRole = 'LAWYER' | 'CUSTOMER';

interface User {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  firm?: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  isLawyer: boolean;
  isCustomer: boolean;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5076';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // SHARED SECRET KEY (MATCHING BACKEND) - loaded from .env
  const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;

  const encryptPassword = (password: string) => {
    // @ts-ignore - CryptoJS is loaded via CDN in index.html
    const key = CryptoJS.SHA256(CLIENT_SECRET);
    // @ts-ignore
    const iv = CryptoJS.lib.WordArray.random(16);
    // @ts-ignore
    const encrypted = CryptoJS.AES.encrypt(password, key, { iv: iv });
    
    // Combine IV and CipherText (matches backend decryption logic)
    // @ts-ignore
    return iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('shingi_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('shingi_user');
      }
    }
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    setError(null);
    try {
      const encryptedPassword = encryptPassword(password);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: encryptedPassword }),
      });

      if (!response.ok) {
        throw new Error('Invalid email or password');
      }

      const data = await response.json();
      const newUser: User = {
        name: data.fullName || data.email,
        email: data.email,
        role: role, // In a real production app, role would come from JWT claims
        token: data.token,
        firm: role === 'LAWYER' ? 'Shingi Legal Associates' : undefined
      };

      setUser(newUser);
      localStorage.setItem('shingi_user', JSON.stringify(newUser));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const encryptedPassword = encryptPassword(password);
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: encryptedPassword, fullName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData[0]?.description || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('shingi_user');
  };

  const isLawyer = user?.role === 'LAWYER';
  const isCustomer = user?.role === 'CUSTOMER';

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLawyer, isCustomer, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
