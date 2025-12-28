import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

// Demo credentials for testing
const DEMO_ACCOUNTS = {
  'admin95': {
    password: 'admin95',
    fullName: 'Administrator',
    phone: '+359 89 999 9999',
    role: 'admin'
  },
  'elena@elenarosephotography.bg': {
    password: 'elena2024',
    fullName: 'Elena Rose',
    phone: '+359 89 123 4567',
    role: 'admin'
  },
  'maria.petrova@example.com': {
    password: 'maria2024',
    fullName: 'Maria Petrova',
    phone: '+359 89 234 5678',
    role: 'client'
  }
};

const isMockMode = import.meta.env.VITE_SUPABASE_URL?.includes('dummy');

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isMockMode) {
      // Check localStorage for mock session
      const mockSession = localStorage.getItem('mockAuthSession');
      if (mockSession) {
        try {
          const sessionData = JSON.parse(mockSession);
          setUser(sessionData);
          setProfile(sessionData.profile);
        } catch (error) {
          console.error('Error parsing mock session:', error);
        }
      }
      setLoading(false);
    } else {
      // Real Supabase session
      supabase?.auth?.getSession()?.then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          loadProfile(session?.user?.id);
        } else {
          setLoading(false);
        }
      });

      // Listen for auth changes (MUST be synchronous)
      const { data: { subscription } } = supabase?.auth?.onAuthStateChange((event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          loadProfile(session?.user?.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      });

      return () => subscription?.unsubscribe();
    }
  }, []);

  const loadProfile = async (userId) => {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error?.message);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    if (isMockMode) {
      // Mock authentication - check demo accounts first, then registered accounts
      let account = DEMO_ACCOUNTS[email];
      
      // If not a demo account, check registered accounts
      if (!account) {
        const registeredAccounts = JSON.parse(localStorage.getItem('registeredAccounts') || '{}');
        account = registeredAccounts[email];
      }
      
      if (!account || account.password !== password) {
        throw new Error('Невалидно имейл или парола');
      }

      const mockUser = {
        id: email.replace(/[^a-z0-9]/gi, ''),
        email,
        user_metadata: {
          full_name: account.fullName,
          phone: account.phone,
          role: account.role
        },
        profile: {
          id: email.replace(/[^a-z0-9]/gi, ''),
          full_name: account.fullName,
          phone: account.phone,
          role: account.role,
          created_at: new Date().toISOString()
        }
      };

      setUser(mockUser);
      setProfile(mockUser.profile);
      localStorage.setItem('mockAuthSession', JSON.stringify(mockUser));
      return { user: mockUser };
    }

    const { data, error } = await supabase?.auth?.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  };

  const signUp = async (email, password, fullName, phone) => {
    if (isMockMode) {
      // Mock registration
      if (!fullName || !email || !password) {
        throw new Error('Моля попълнете всички задължителни полета');
      }

      const mockUser = {
        id: email.replace(/[^a-z0-9]/gi, ''),
        email,
        user_metadata: {
          full_name: fullName,
          phone: phone || '',
          role: 'client'
        },
        profile: {
          id: email.replace(/[^a-z0-9]/gi, ''),
          full_name: fullName,
          phone: phone || '',
          role: 'client',
          created_at: new Date().toISOString()
        }
      };

      // Store in localStorage instead of Supabase
      const registeredAccounts = JSON.parse(localStorage.getItem('registeredAccounts') || '{}');
      registeredAccounts[email] = {
        password,
        fullName,
        phone,
        role: 'client'
      };
      localStorage.setItem('registeredAccounts', JSON.stringify(registeredAccounts));

      setUser(mockUser);
      setProfile(mockUser.profile);
      localStorage.setItem('mockAuthSession', JSON.stringify(mockUser));
      return { user: mockUser };
    }

    const { data, error } = await supabase?.auth?.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone || '',
          role: 'client'
        }
      }
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    if (isMockMode) {
      setUser(null);
      setProfile(null);
      localStorage.removeItem('mockAuthSession');
      return;
    }

    const { error } = await supabase?.auth?.signOut();
    if (error) throw error;
  };

  const updateProfile = async (updates) => {
    if (!user) throw new Error('Not authenticated');
    
    if (isMockMode) {
      const updatedProfile = { ...profile, ...updates };
      setProfile(updatedProfile);
      const updatedUser = { ...user, profile: updatedProfile };
      localStorage.setItem('mockAuthSession', JSON.stringify(updatedUser));
      return updatedProfile;
    }
    
    const { data, error } = await supabase?.from('user_profiles')?.update(updates)?.eq('id', user?.id)?.select()?.single();

    if (error) throw error;
    setProfile(data);
    return data;
  };

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;