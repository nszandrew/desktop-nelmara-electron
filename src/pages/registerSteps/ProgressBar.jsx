// src/pages/registerSteps/ProgressBar.jsx
import React from 'react';

export default function ProgressBar({ currentStep, totalSteps }) {
  const percentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div style={styles.wrapper}>
      <div style={{ ...styles.filler, width: `${percentage}%` }} />
      <span style={styles.label}>Etapa {currentStep + 1} de {totalSteps}</span>
    </div>
  );
}

const styles = {
  wrapper: {
    position: 'relative',
    height: '14px',
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '2rem',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
  },
  filler: {
    height: '100%',
    backgroundColor: '#00C9A7',
    borderRadius: '12px 0 0 12px',
    transition: 'width 0.4s ease-in-out',
  },
  label: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginTop: '0.5rem',
    fontWeight: '500',
    color: '#025C4A',
    fontSize: '0.95rem',
    fontFamily: 'Segoe UI, sans-serif',
  }
};
