// src/pages/registerSteps/PatientStep.jsx
import React from 'react';

export default function PatientStep({ data, onChange }) {
  const handleInput = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Dados Pessoais</h3>
      <div style={styles.formGroup}>
        <input name="fullName" placeholder="Nome completo" value={data.fullName || ''} onChange={handleInput} style={styles.input} />
        <input name="cpf" placeholder="CPF" value={data.cpf || ''} onChange={handleInput} style={styles.input} />
        <input name="email" placeholder="E-mail" value={data.email || ''} onChange={handleInput} style={styles.input} />
        <input name="phone" placeholder="Telefone" value={data.phone || ''} onChange={handleInput} style={styles.input} />
        <input name="dateOfBirth" type="date" placeholder="Data de nascimento" value={data.dateOfBirth || ''} onChange={handleInput} style={styles.input} />
        <input name="address" placeholder="Endereço" value={data.address || ''} onChange={handleInput} style={styles.input} />
        <input name="profession" placeholder="Profissão" value={data.profession || ''} onChange={handleInput} style={styles.input} />
        <input name="indication" placeholder="Indicação" value={data.indication || ''} onChange={handleInput} style={styles.input} />
        <select name="gender" value={data.gender || ''} onChange={handleInput} style={styles.input}>
          <option value="">Selecione o Gênero</option>
          <option value="MALE">Masculino</option>
          <option value="FEMALE">Feminino</option>
          <option value="NA">Não informado</option>
        </select>
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
