import React from 'react';

export default function ProgressBar({ currentStep, totalSteps }) {
  const percentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div style={styles.container}>
      <div style={{ ...styles.bar, width: `${percentage}%` }} />
    </div>
  );
}

const styles = {
  container: {
    height: '10px',
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: '5px',
    marginBottom: '2rem',
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: '#00C9A7',
    transition: 'width 0.4s ease-in-out'
  }
};
