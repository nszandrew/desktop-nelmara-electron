import React from 'react';
import { AuthProvider } from './contexts/AuthContext.jsx';
import LoginPage from './pages/LoginPage.jsx';

export default function App() {
  return (
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  );
}