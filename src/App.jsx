import React from 'react';
import Routes from './Routes';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './hooks/useLanguage';
import ErrorBoundary from './components/ErrorBoundary';
import { useEffect } from 'react';
import { realtimeService } from './services/realtimeService';

function App() {
  // Cleanup real-time subscriptions on unmount
  useEffect(() => {
    return () => {
      realtimeService?.unsubscribeAll();
    };
  }, []);

  return (
    <LanguageProvider>
      <AuthProvider>
        <ErrorBoundary>
          <Routes />
        </ErrorBoundary>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;