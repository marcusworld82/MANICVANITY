import React, { createContext, useContext, useEffect, useState } from 'react';
import { db, generateId } from '../lib/database';
import bcrypt from 'bcryptjs';

interface User {
  id: string;
  email: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const LocalAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('manicvanity-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('manicvanity-user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
      const dbUser = stmt.get(email) as any;
      
      if (!dbUser) {
        return { error: { message: 'Invalid email or password' } };
      }

      const isValidPassword = await bcrypt.compare(password, dbUser.password_hash);
      if (!isValidPassword) {
        return { error: { message: 'Invalid email or password' } };
      }

      const user: User = {
        id: dbUser.id,
        email: dbUser.email,
        created_at: dbUser.created_at
      };

      setUser(user);
      localStorage.setItem('manicvanity-user', JSON.stringify(user));
      
      return { error: null };
    } catch (error) {
      return { error: { message: 'Sign in failed' } };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      // Check if user already exists
      const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
      if (existingUser) {
        return { error: { message: 'User already exists' } };
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);
      
      // Create user
      const stmt = db.prepare(`
        INSERT INTO users (id, email, password_hash)
        VALUES (?, ?, ?)
      `);
      const id = generateId();
      stmt.run(id, email, passwordHash);

      const user: User = {
        id,
        email,
        created_at: new Date().toISOString()
      };

      setUser(user);
      localStorage.setItem('manicvanity-user', JSON.stringify(user));
      
      return { error: null };
    } catch (error) {
      return { error: { message: 'Sign up failed' } };
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('manicvanity-user');
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};