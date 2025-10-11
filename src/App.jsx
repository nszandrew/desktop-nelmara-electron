import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import HomePage from './pages/HomePage.jsx';
import PatientRegisterPage from './pages/PatientRegisterPage';
import EditPatientPage from './pages/EditPatientPage.jsx';
import PatientViewPage from './pages/PatientViewPage.jsx';
import TreatmentTemplatePage from './pages/TreatmentTemplateList.jsx';
import RmaPage from './pages/RmaPage.jsx';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = React.useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function PinLockScreen({ onUnlock }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const correctPin = '1234';

  function handleSubmit(e) {
    e.preventDefault();
    if (pin === correctPin) {
      setPin('');
      setError('');
      onUnlock();
    } else {
      setError('PIN incorreto');
    }
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'linear-gradient(135deg, #00C9A7 0%, #037E63 100%)',
      zIndex: 9999, display: 'flex',
      alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
    }}>
      <div style={{
        background: '#F5F5F5',
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(2,92,74,0.15)',
        padding: '40px 32px',
        minWidth: 340,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '2px solid #025C4A'
      }}>
        <h2 style={{
          color: '#037E63',
          marginBottom: 24,
          fontWeight: 700,
          fontSize: 28,
          letterSpacing: 1
        }}>
          Digite seu PIN de Segurança
        </h2>
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input
            type="password"
            value={pin}
            onChange={e => setPin(e.target.value)}
            placeholder="PIN"
            style={{
              fontSize: 24,
              padding: '12px 18px',
              borderRadius: 8,
              border: '2px solid #025C4A',
              outline: 'none',
              marginBottom: 18,
              background: '#FFFFFF',
              color: '#025C4A',
              width: '100%',
              textAlign: 'center',
              boxSizing: 'border-box'
            }}
          />
          <button
            type="submit"
            style={{
              fontSize: 22,
              padding: '10px 0',
              borderRadius: 8,
              border: 'none',
              background: '#037E63',
              color: '#FFFFFF',
              fontWeight: 600,
              width: '100%',
              cursor: 'pointer',
              transition: 'background 0.2s',
              marginBottom: 8
            }}
            onMouseOver={e => e.currentTarget.style.background = '#029B7B'}
            onMouseOut={e => e.currentTarget.style.background = '#037E63'}
          >
            Desbloquear
          </button>
        </form>
        {error && <div style={{ color: '#333333', background: '#00C9A7', borderRadius: 6, padding: '6px 12px', marginTop: 10, fontWeight: 500 }}>{error}</div>}
      </div>
      <div style={{ marginTop: 32, color: '#025C4A', fontSize: 16, fontWeight: 400 }}>
        Por segurança, o acesso será bloqueado após 10 minutos de inatividade.
      </div>
    </div>
  );
}

export default function App() {
  const [locked, setLocked] = useState(true);
  const timeoutRef = useRef();

  // Função para resetar o timer de inatividade
  function resetTimeout() {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setLocked(true), 10 * 60 * 1000); // 10 minutos
  }

  useEffect(() => {
    if (!locked) {
      // Monitora eventos de atividade
      window.addEventListener('mousemove', resetTimeout);
      window.addEventListener('keydown', resetTimeout);
      window.addEventListener('mousedown', resetTimeout);
      resetTimeout();
      return () => {
        window.removeEventListener('mousemove', resetTimeout);
        window.removeEventListener('keydown', resetTimeout);
        window.removeEventListener('mousedown', resetTimeout);
        clearTimeout(timeoutRef.current);
      };
    } else {
      clearTimeout(timeoutRef.current);
    }
  }, [locked]);

  return (
    <>
      {locked && <PinLockScreen onUnlock={() => setLocked(false)} />}
      {!locked && (
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register-patient" element={<PatientRegisterPage />} /> {/* ✅ nova rota */}
              <Route path="/edit-patient/:id" element={<EditPatientPage />} />
              <Route path="/view-patient/:id" element={<PatientViewPage />} />
              <Route path="/treatments" element={<TreatmentTemplatePage />} />
              <Route path="/rma" element={<RmaPage />} />
              <Route path="/rma/:page" element={<RmaPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HomePage onLock={() => setLocked(true)} />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </AuthProvider>
      )}
    </>
  );
}
