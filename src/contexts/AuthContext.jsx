import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  isValidEmail, 
  isValidPhone, 
  sanitizeInput, 
  loginRateLimiter,
  secureStorage,
  detectMaliciousInput
} from '../utils/security';

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
    fullName: 'Desislava Tepavicharova',
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

// Password strength validation
const validatePasswordStrength = (password) => {
  if (!password || password.length < 8) {
    return { isValid: false, message: 'Паролата трябва да е поне 8 символа.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Паролата трябва да съдържа поне една главна буква.' };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Паролата трябва да съдържа поне една малка буква.' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Паролата трябва да съдържа поне една цифра.' };
  }
  return { isValid: true };
};

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
    // Input validation
    if (!email || !password) {
      throw new Error('Имейл и парола са задължителни.');
    }

    // Sanitize inputs
    const cleanEmail = sanitizeInput(email.toLowerCase().trim());
    const cleanPassword = password.trim();

    // Validate email format
    if (!isValidEmail(cleanEmail)) {
      throw new Error('Невалиден имейл адрес.');
    }

    // Check for malicious input
    if (detectMaliciousInput(cleanEmail) || detectMaliciousInput(cleanPassword)) {
      throw new Error('Невалидни данни.');
    }

    // Check rate limiting
    if (!loginRateLimiter.isAllowed(cleanEmail)) {
      throw new Error('Твърде много опити за вход. Моля изчакайте 5 минути.');
    }

    if (isMockMode) {
      // Mock authentication - check demo accounts first, then registered accounts
      let account = DEMO_ACCOUNTS[cleanEmail];
      
      // If not a demo account, check registered accounts
      if (!account) {
        const registeredAccounts = secureStorage.getItem('registeredAccounts') || {};
        account = registeredAccounts[cleanEmail];
      }
      
      if (!account || account.password !== cleanPassword) {
        throw new Error('Невалидно имейл или парола');
      }

      // Reset rate limiter on successful login
      loginRateLimiter.reset(cleanEmail);

      const mockUser = {
        id: cleanEmail.replace(/[^a-z0-9]/gi, ''),
        email: cleanEmail,
        user_metadata: {
          full_name: account.fullName,
          phone: account.phone,
          role: account.role
        },
        profile: {
          id: cleanEmail.replace(/[^a-z0-9]/gi, ''),
          full_name: account.fullName,
          phone: account.phone,
          role: account.role,
          created_at: new Date().toISOString()
        }
      };

      setUser(mockUser);
      setProfile(mockUser.profile);
      secureStorage.setItem('mockAuthSession', mockUser);
      return { user: mockUser };
    }

    const { data, error } = await supabase?.auth?.signInWithPassword({
      email: cleanEmail,
      password: cleanPassword
    });
    
    if (error) throw error;
    
    // Reset rate limiter on successful login
    loginRateLimiter.reset(cleanEmail);
    
    return data;
  };

  const signUp = async (email, password, fullName, phone) => {
    // Input validation
    if (!fullName || !email || !password) {
      throw new Error('Моля попълнете всички задължителни полета');
    }

    // Sanitize inputs
    const cleanEmail = sanitizeInput(email.toLowerCase().trim());
    const cleanFullName = sanitizeInput(fullName.trim());
    const cleanPhone = phone ? sanitizeInput(phone.trim()) : '';

    // Validate email
    if (!isValidEmail(cleanEmail)) {
      throw new Error('Невалиден имейл адрес.');
    }

    // Validate phone if provided
    if (cleanPhone && !isValidPhone(cleanPhone)) {
      throw new Error('Невалиден телефонен номер.');
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.message);
    }

    // Check for malicious input
    if (detectMaliciousInput(cleanEmail) || detectMaliciousInput(cleanFullName)) {
      throw new Error('Невалидни данни.');
    }

    if (isMockMode) {
      const mockUser = {
        id: cleanEmail.replace(/[^a-z0-9]/gi, ''),
        email: cleanEmail,
        user_metadata: {
          full_name: cleanFullName,
          phone: cleanPhone,
          role: 'client'
        },
        profile: {
          id: cleanEmail.replace(/[^a-z0-9]/gi, ''),
          full_name: cleanFullName,
          phone: cleanPhone,
          role: 'client',
          created_at: new Date().toISOString()
        }
      };

      // Store in secure storage
      const registeredAccounts = secureStorage.getItem('registeredAccounts') || {};
      registeredAccounts[cleanEmail] = {
        password,
        fullName: cleanFullName,
        phone: cleanPhone,
        role: 'client'
      };
      secureStorage.setItem('registeredAccounts', registeredAccounts);

      setUser(mockUser);
      setProfile(mockUser.profile);
      secureStorage.setItem('mockAuthSession', mockUser);
      return { user: mockUser };
    }

    const { data, error } = await supabase?.auth?.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: cleanFullName,
          phone: cleanPhone,
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
      secureStorage.removeItem('mockAuthSession');
      sessionStorage.clear(); // Clear all session data
      return;
    }

    const { error } = await supabase?.auth?.signOut();
    if (error) throw error;
    sessionStorage.clear(); // Clear all session data
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