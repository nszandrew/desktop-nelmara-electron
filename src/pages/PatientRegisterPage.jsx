import React, { useState } from 'react';
import PatientStep from './registerSteps/PatientStep';
import EvaluationStep from './registerSteps/EvaluationStep';
import MedicalHistoryStep from './registerSteps/MedicalHistoryStep';
import LifestyleStep from './registerSteps/LifestyleStep';
import ProgressBar from './registerSteps/ProgressBar';
import api from '../services/api';

export default function PatientRegisterPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    patient: {},
    evaluation: {},
    medicalHistory: {},
    lifestyle: {}
  });

  const steps = [
    { component: PatientStep, key: 'patient' },
    { component: EvaluationStep, key: 'evaluation' },
    { component: MedicalHistoryStep, key: 'medicalHistory' },
    { component: LifestyleStep, key: 'lifestyle' },
  ];

  const CurrentStep = steps[step].component;

  const handleChange = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.post('/api/patient', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Paciente registrado com sucesso!');
    } catch (err) {
      console.error('Erro ao registrar paciente:', err);
      alert('Erro ao registrar paciente.');
    }
  };

  return (
    <div style={styles.container}>
      <ProgressBar currentStep={step} totalSteps={steps.length} />
      <div style={styles.stepWrapper}>
        <CurrentStep data={formData[steps[step].key]} onChange={(data) => handleChange(steps[step].key, data)} />
      </div>
      <div style={styles.buttons}>
        {step > 0 && <button onClick={() => setStep(step - 1)} style={styles.back}>← Voltar</button>}
        {step < steps.length - 1
          ? <button onClick={() => setStep(step + 1)} style={styles.next}>Avançar →</button>
          : <button onClick={handleSubmit} style={styles.submit}>Salvar Paciente</button>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
    fontFamily: 'Segoe UI, sans-serif',
    animation: 'fadeIn 0.5s ease-in-out',
  },
  stepWrapper: {
    minHeight: '400px',
    transition: 'all 0.3s ease',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '2rem',
  },
  back: {
    padding: '0.7rem 1.2rem',
    backgroundColor: '#d3d3d3',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  next: {
    padding: '0.7rem 1.2rem',
    backgroundColor: '#00C9A7',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  submit: {
    padding: '0.7rem 1.2rem',
    backgroundColor: '#037E63',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};
