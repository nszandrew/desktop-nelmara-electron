// src/pages/registerSteps/EvaluationStep.jsx
import React from 'react';

export default function EvaluationStep({ data, onChange }) {
  const handleInput = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Avaliação Clínica</h3>
      <div style={styles.formGroup}>
        <input
          type="date"
          name="date"
          value={data.date || ''}
          onChange={handleInput}
          style={styles.input}
          placeholder="Data"
        />
        <input
          name="mainComplaint"
          placeholder="Queixa principal"
          value={data.mainComplaint || ''}
          onChange={handleInput}
          style={styles.input}
        />
        <input
          name="hmp"
          placeholder="HMP (História da Moléstia Pregressa)"
          value={data.hmp || ''}
          onChange={handleInput}
          style={styles.input}
        />
        <input
          name="hma"
          placeholder="HMA (História da Moléstia Atual)"
          value={data.hma || ''}
          onChange={handleInput}
          style={styles.input}
        />
        <input
          type="number"
          name="weight"
          placeholder="Peso (kg)"
          value={data.weight || ''}
          onChange={handleInput}
          style={styles.input}
        />
        <input
          type="number"
          name="height"
          placeholder="Altura (cm)"
          value={data.height || ''}
          onChange={handleInput}
          style={styles.input}
        />
        <input
          type="number"
          name="painLevel"
          placeholder="Nível de dor (0 a 10)"
          value={data.painLevel || ''}
          onChange={handleInput}
          style={styles.input}
        />
        <input
          name="heartRate"
          placeholder="Frequência Cardíaca"
          value={data.heartRate || ''}
          onChange={handleInput}
          style={styles.input}
        />
        <input
          name="respiratoryRate"
          placeholder="Frequência Respiratória"
          value={data.respiratoryRate || ''}
          onChange={handleInput}
          style={styles.input}
        />
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
  formGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    outlineColor: '#00C9A7',
  }
};
