import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';
import api from '../services/api';

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/api/auth/login', { email, password });
      login(res.data.token);
      window.location.href = '/';
    } catch (err) {
      setError('Login inválido. Verifique os dados.');
    }
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes backgroundFade {
        0% { background-color: #00C9A7; }
        50% { background-color: #029B7B; }
        100% { background-color: #00C9A7; }
      }
      body {
        margin: 0;
        font-family: Arial, sans-serif;
        animation: backgroundFade 6s ease-in-out infinite;
        background: #00C9A7;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Bem-vindo(a)</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button
          type="submit"
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#029B7B')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#037E63')}
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 400,
    margin: '8rem auto',
    padding: '2rem',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)',
    textAlign: 'center',
  },
  title: {
    marginBottom: '1.8rem',
    fontSize: '2rem',
    color: '#025C4A',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '0.9rem',
    marginBottom: '1.2rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    outlineColor: '#037E63',
  },
  button: {
    padding: '0.9rem',
    backgroundColor: '#037E63',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
    transition: 'background 0.3s ease',
  },
  error: {
    color: '#d00',
    fontSize: '0.9rem',
    marginBottom: '1rem',
  }
};
