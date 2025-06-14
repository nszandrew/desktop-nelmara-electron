// src/pages/registerSteps/MedicalHistoryStep.jsx
import React from 'react';

export default function MedicalHistoryStep({ data, onChange }) {
  const handleCheckbox = (e) => {
    const { name, checked } = e.target;
    onChange({ [name]: checked });
  };

  const handleText = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const conditions = [
    'allergy',
    'enzymeDeficiencyG6PD',
    'sinusitis',
    'rhinitis',
    'diabetesMellitus',
    'highBloodPressure',
    'cardiopathy',
    'anemia',
    'hyperthyroidism',
    'recentCovidVaccine',
    'recentHemorrhage'
  ];

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Histórico Médico</h3>

      <input
        name="associatedConditions"
        placeholder="Condições Associadas"
        value={data.associatedConditions || ''}
        onChange={handleText}
        style={styles.input}
      />

      <div style={styles.checkboxGrid}>
        {conditions.map((condition) => (
          <label key={condition} style={styles.checkboxLabel}>
            <input
              type="checkbox"
              name={condition}
              checked={data[condition] || false}
              onChange={handleCheckbox}
              style={styles.checkbox}
            />
            {formatLabel(condition)}
          </label>
        ))}
      </div>
    </div>
  );
}

function formatLabel(key) {
  const map = {
    allergy: 'Alergia',
    enzymeDeficiencyG6PD: 'Def. G6PD',
    sinusitis: 'Sinusite',
    rhinitis: 'Rinite',
    diabetesMellitus: 'Diabetes',
    highBloodPressure: 'Hipertensão',
    cardiopathy: 'Cardiopatia',
    anemia: 'Anemia',
    hyperthyroidism: 'Hipertireoidismo',
    recentCovidVaccine: 'Vacina COVID recente',
    recentHemorrhage: 'Hemorragia recente'
  };
  return map[key] || key;
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
    marginBottom: '1.5rem',
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    outlineColor: '#00C9A7',
  },
  checkboxGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.8rem',
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
