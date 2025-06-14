// src/pages/registerSteps/LifestyleStep.jsx
import React from 'react';

export default function LifestyleStep({ data, onChange }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onChange({ [name]: type === 'checkbox' ? checked : value });
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Estilo de Vida</h3>

      <input
        name="physicalActivity"
        placeholder="Atividades Físicas"
        value={data.physicalActivity || ''}
        onChange={handleChange}
        style={styles.input}
      />

      <input
        name="pastSurgeries"
        placeholder="Cirurgias Anteriores"
        value={data.pastSurgeries || ''}
        onChange={handleChange}
        style={styles.input}
      />

      <input
        name="fractures"
        placeholder="Fraturas"
        value={data.fractures || ''}
        onChange={handleChange}
        style={styles.input}
      />

      <input
        name="medications"
        placeholder="Medicamentos em uso"
        value={data.medications || ''}
        onChange={handleChange}
        style={styles.input}
      />

      <div style={styles.checkGroup}>
        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="smoking"
            checked={data.smoking || false}
            onChange={handleChange}
            style={styles.checkbox}
          />
          Fuma
        </label>
        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="alcohol"
            checked={data.alcohol || false}
            onChange={handleChange}
            style={styles.checkbox}
          />
          Consome álcool
        </label>
      </div>
    </div>
  );
}

const styles = {
  container: {
    animation: 'fadeIn 0.4s ease-in-out',
  },
  title: {
    color: '#025C4A',
    fontSize: '1.4rem',
    marginBottom: '1rem',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    marginBottom: '1rem',
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    outlineColor: '#00C9A7',
  },
  checkGroup: {
    display: 'flex',
    gap: '2rem',
    marginTop: '1rem',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    fontSize: '1rem',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  }
};
