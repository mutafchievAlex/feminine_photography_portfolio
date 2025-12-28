import React from 'react';
import Routes from './Routes';
import QueryProvider from './providers/QueryProvider';
import { LanguageProvider } from './hooks/useLanguage';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <QueryProvider>
          <Routes />
        </QueryProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;