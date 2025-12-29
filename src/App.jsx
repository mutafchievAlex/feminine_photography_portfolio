import React from 'react';
import Routes from './Routes';
import QueryProvider from './providers/QueryProvider';
import { LanguageProvider } from './hooks/useLanguage';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
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