import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import HomePage from './pages/HomePage.jsx';
import PatientRegisterPage from './pages/PatientRegisterPage';
import EditPatientPage from './pages/EditPatientPage.jsx';
import PatientViewPage from './pages/PatientViewPage.jsx';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = React.useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register-patient" element={<PatientRegisterPage />} /> {/* ✅ nova rota */}
          <Route path="/edit-patient/:id" element={<EditPatientPage />} />
          <Route path="/view-patient/:id" element={<PatientViewPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
