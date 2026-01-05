import React, { useEffect } from 'react';
import Routes from './Routes';
import QueryProvider from './providers/QueryProvider';
import { LanguageProvider } from './hooks/useLanguage';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { setCSRFToken, preventClickjacking, applyCSP } from './utils/security';

function App() {
  useEffect(() => {
    // Initialize security measures
    setCSRFToken(); // Generate CSRF token
    preventClickjacking(); // Prevent iframe embedding
    applyCSP(); // Apply Content Security Policy

    // Add security headers via meta tags
    const metaTags = [
      { httpEquiv: 'X-Content-Type-Options', content: 'nosniff' },
      { httpEquiv: 'X-Frame-Options', content: 'DENY' },
      { httpEquiv: 'X-XSS-Protection', content: '1; mode=block' },
      { httpEquiv: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' },
      { httpEquiv: 'Permissions-Policy', content: 'camera=(), microphone=(), geolocation=()' }
    ];

    metaTags.forEach(({ httpEquiv, content }) => {
      const meta = document.createElement('meta');
      meta.httpEquiv = httpEquiv;
      meta.content = content;
      document.head.appendChild(meta);
    });

    // Clear sensitive data on page unload
    const handleBeforeUnload = () => {
      // Don't clear CSRF token, only clear sensitive cached data
      sessionStorage.removeItem('tempFormData');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <QueryProvider>
            <Routes />
          </QueryProvider>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;