// Sidebar.jsx
import React, { useState } from 'react';
import { FaUser, FaFileMedical, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo-nelmara.png'; // ajuste o caminho se necessário

export default function Sidebar() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div
      style={{
        ...styles.sidebar,
        width: expanded ? '200px' : '70px',
      }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div style={styles.topMenu}>
        <div style={styles.logoArea}>
          <img
            src={logo}
            alt="Nelmara Logo"
            style={{
              ...styles.logoImage,
              width: expanded ? '140px' : '40px',
              opacity: expanded ? 1 : 0.9,
            }}
          />
        </div>

        <div style={styles.menuItem} onClick={() => navigate('/')}>
          <FaUser style={styles.icon} />
          {expanded && <span style={styles.label}>Pacientes</span>}
        </div>

        <div style={styles.menuItem} onClick={() => navigate('/treatments')}>
          <FaFileMedical style={styles.icon} />
          {expanded && <span style={styles.label}>Tratamentos</span>}
        </div>
      </div>

      <div style={{ ...styles.menuItem, ...styles.logout }} onClick={logout}>
        <FaSignOutAlt style={styles.icon} />
        {expanded && <span style={styles.label}>Sair</span>}
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    height: '100vh',
    backgroundColor: '#037E63',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '1rem 0.5rem',
    position: 'fixed',
    left: 0,
    top: 0,
    transition: 'width 0.3s ease',
    overflow: 'hidden',
    zIndex: 10,
  },
  topMenu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  logoArea: {
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    maxWidth: '100%',
    height: 'auto',
    transition: 'width 0.3s ease, opacity 0.3s ease',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '1rem',
    cursor: 'pointer',
    transition: 'background 0.3s',
    fontSize: '1rem',
    fontWeight: 500,
    fontFamily: 'Segoe UI, sans-serif',
    borderRadius: '8px',
    margin: '0 8px',
  },
  logout: {
    backgroundColor: '#d33',
    marginBottom: '0.5rem',
  },
  icon: {
    fontSize: '1.3rem',
  },
  label: {
    transition: 'opacity 0.3s ease',
  },
};
