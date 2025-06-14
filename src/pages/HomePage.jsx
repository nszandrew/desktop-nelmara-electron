import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Sidebar from './Sidebar';

export default function HomePage() {
  const [patients, setPatients] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get(`/patient?page=${page}&size=10&direction=asc`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPatients(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error('Erro ao buscar pacientes:', err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [page]);

  const nextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  return (
    <div style={styles.wrapper}>
      <Sidebar />
      <div style={styles.content}>
        <div style={styles.header}>
          <h2 style={styles.headerTitle}>Pacientes</h2>
          <button
            style={styles.button}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#029B7B')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#00C9A7')}
          >
            + Novo Paciente
          </button>
        </div>

        <div style={styles.list}>
          {patients.map((p) => (
            <div key={p.id} style={styles.card}>
              <div>
                <strong>{p.fullName}</strong>
                <p>{p.email}</p>
                <p>{p.phone}</p>
              </div>
              <div style={styles.cardActions}>
                <button style={styles.action}>Ver</button>
                <button style={styles.action}>Editar</button>
                <button style={styles.delete}>Excluir</button>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.pagination}>
          <button onClick={prevPage} style={styles.pageButton} disabled={page === 0}>← Anterior</button>
          <span style={styles.pageLabel}>Página {page + 1} de {totalPages}</span>
          <button onClick={nextPage} style={styles.pageButton} disabled={page >= totalPages - 1}>Próxima →</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    background: '#F5F5F5',
    fontFamily: 'Segoe UI, sans-serif',
  },
  content: {
    marginLeft: '70px',
    padding: '2rem',
    width: '100%',
    animation: 'fadeIn 0.5s ease-in',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    borderBottom: '2px solid #00C9A7',
    paddingBottom: '1rem',
  },
  headerTitle: {
    fontSize: '1.8rem',
    color: '#025C4A',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#00C9A7',
    color: '#fff',
    border: 'none',
    padding: '0.7rem 1.3rem',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  cardActions: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center'
  },
  action: {
    backgroundColor: '#029B7B',
    color: '#fff',
    border: 'none',
    padding: '0.4rem 0.9rem',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
  delete: {
    backgroundColor: '#d33',
    color: '#fff',
    border: 'none',
    padding: '0.4rem 0.9rem',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
  pagination: {
    marginTop: '2rem',
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    alignItems: 'center',
  },
  pageButton: {
    padding: '0.6rem 1rem',
    backgroundColor: '#037E63',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.95rem',
    transition: 'background 0.3s ease',
  },
  pageLabel: {
    fontSize: '1rem',
    color: '#333',
    fontWeight: '500',
  }
};
