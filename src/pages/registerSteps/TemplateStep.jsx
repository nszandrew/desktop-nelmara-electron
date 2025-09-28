import React, { useEffect, useState } from "react";
import api from "../../services/api";

// Array fixo com os 6 templates e seus campos (apenas exemplo resumido)
export const TEMPLATES = [
  {
    id: 1,
    name: "Neurológica",
    fields: [
      { fieldName: "Queixa Principal", fieldType: "STRING", required: true },
      { fieldName: "painLevel", fieldType: "NUMBER", required: false },
      { fieldName: "date", fieldType: "DATE", required: true },
      { fieldName: "hmp", fieldType: "STRING", required: false },
      { fieldName: "hma", fieldType: "STRING", required: false },
      { fieldName: "associatedConditions", fieldType: "STRING", required: false },
      { fieldName: "allergy", fieldType: "BOOLEAN", required: false },
      { fieldName: "enzymeDeficiencyG6PD", fieldType: "BOOLEAN", required: false },
      { fieldName: "sinusitis", fieldType: "BOOLEAN", required: false },
      { fieldName: "rhinitis", fieldType: "BOOLEAN", required: false },
      { fieldName: "diabetesMellitus", fieldType: "BOOLEAN", required: false },
      { fieldName: "highBloodPressure", fieldType: "BOOLEAN", required: false },
      { fieldName: "cardiopathy", fieldType: "BOOLEAN", required: false },
      { fieldName: "anemia", fieldType: "BOOLEAN", required: false },
      { fieldName: "hyperthyroidism", fieldType: "BOOLEAN", required: false },
      { fieldName: "epilepsyOrSeizures", fieldType: "BOOLEAN", required: false },
      { fieldName: "mentalDisorder", fieldType: "BOOLEAN", required: false },
      { fieldName: "recentCovidVaccine", fieldType: "BOOLEAN", required: false },
      { fieldName: "recentHemorrhage", fieldType: "BOOLEAN", required: false },
      { fieldName: "physicalActivity", fieldType: "STRING", required: false },
      { fieldName: "pastSurgeries", fieldType: "STRING", required: false },
      { fieldName: "fractures", fieldType: "STRING", required: false },
      { fieldName: "smoking", fieldType: "BOOLEAN", required: false },
      { fieldName: "alcohol", fieldType: "BOOLEAN", required: false },
      { fieldName: "medications", fieldType: "STRING", required: false },
      { fieldName: "Inspeção - Pele", fieldType: "STRING", required: true },
      { fieldName: "Inspeção - Aspecto", fieldType: "STRING", required: true },
      { fieldName: "Inspeção - Deformidades", fieldType: "STRING", required: true },
      { fieldName: "Marcha", fieldType: "STRING", required: true },
      { fieldName: "Trocas Posturais", fieldType: "STRING", required: true },
      { fieldName: "AVDs (Atividades da Vida Diária)", fieldType: "STRING", required: false },
      { fieldName: "Observações", fieldType: "STRING", required: false },
      { fieldName: "weight", fieldType: "NUMBER", required: false },
      { fieldName: "height", fieldType: "NUMBER", required: false },
      { fieldName: "heartRate", fieldType: "STRING", required: false },
      { fieldName: "respiratoryRate", fieldType: "STRING", required: false }
    ]
  },
  {
    id: 2,
    name: "Postural",
    fields: [
      { fieldName: "Queixa Principal", fieldType: "STRING", required: true },
      { fieldName: "painLevel", fieldType: "NUMBER", required: false },
      { fieldName: "date", fieldType: "DATE", required: true },
      { fieldName: "hmp", fieldType: "STRING", required: false },
      { fieldName: "hma", fieldType: "STRING", required: false },
      { fieldName: "associatedConditions", fieldType: "STRING", required: false },
      { fieldName: "allergy", fieldType: "BOOLEAN", required: false },
      { fieldName: "enzymeDeficiencyG6PD", fieldType: "BOOLEAN", required: false },
      { fieldName: "sinusitis", fieldType: "BOOLEAN", required: false },
      { fieldName: "rhinitis", fieldType: "BOOLEAN", required: false },
      { fieldName: "diabetesMellitus", fieldType: "BOOLEAN", required: false },
      { fieldName: "highBloodPressure", fieldType: "BOOLEAN", required: false },
      { fieldName: "cardiopathy", fieldType: "BOOLEAN", required: false },
      { fieldName: "anemia", fieldType: "BOOLEAN", required: false },
      { fieldName: "hyperthyroidism", fieldType: "BOOLEAN", required: false },
      { fieldName: "epilepsyOrSeizures", fieldType: "BOOLEAN", required: false },
      { fieldName: "mentalDisorder", fieldType: "BOOLEAN", required: false },
      { fieldName: "recentCovidVaccine", fieldType: "BOOLEAN", required: false },
      { fieldName: "recentHemorrhage", fieldType: "BOOLEAN", required: false },
      { fieldName: "physicalActivity", fieldType: "STRING", required: false },
      { fieldName: "pastSurgeries", fieldType: "STRING", required: false },
      { fieldName: "fractures", fieldType: "STRING", required: false },
      { fieldName: "smoking", fieldType: "BOOLEAN", required: false },
      { fieldName: "alcohol", fieldType: "BOOLEAN", required: false },
      { fieldName: "medications", fieldType: "STRING", required: false },
      { fieldName: "Marcha", fieldType: "STRING", required: false },
      { fieldName: "Vista Anterior", fieldType: "STRING", required: false },
      { fieldName: "Vista Lateral Direita", fieldType: "STRING", required: false },
      { fieldName: "Vista Lateral Esquerda", fieldType: "STRING", required: false },
      { fieldName: "Vista Posterior", fieldType: "STRING", required: false },
      { fieldName: "Flexão Anterior Lateral", fieldType: "STRING", required: false },
      { fieldName: "Flexão Anterior A.P", fieldType: "STRING", required: false },
      { fieldName: "Postura de Trabalho - Sentada (Horas)", fieldType: "STRING", required: false },
      { fieldName: "Postura de Trabalho - Em Pé (Horas)", fieldType: "STRING", required: false },
      { fieldName: "weight", fieldType: "NUMBER", required: false },
      { fieldName: "height", fieldType: "NUMBER", required: false },
      { fieldName: "heartRate", fieldType: "STRING", required: false },
      { fieldName: "respiratoryRate", fieldType: "STRING", required: false }
    ]
  },
  {
    id: 3,
    name: "Ortopédica",
    fields: [
      { fieldName: "Queixa Principal", fieldType: "STRING", required: true },
      { fieldName: "painLevel", fieldType: "NUMBER", required: false },
      { fieldName: "date", fieldType: "DATE", required: true },
      { fieldName: "hmp", fieldType: "STRING", required: false },
      { fieldName: "hma", fieldType: "STRING", required: false },
      { fieldName: "associatedConditions", fieldType: "STRING", required: false },
      { fieldName: "allergy", fieldType: "BOOLEAN", required: false },
      { fieldName: "enzymeDeficiencyG6PD", fieldType: "BOOLEAN", required: false },
      { fieldName: "sinusitis", fieldType: "BOOLEAN", required: false },
      { fieldName: "rhinitis", fieldType: "BOOLEAN", required: false },
      { fieldName: "diabetesMellitus", fieldType: "BOOLEAN", required: false },
      { fieldName: "highBloodPressure", fieldType: "BOOLEAN", required: false },
      { fieldName: "cardiopathy", fieldType: "BOOLEAN", required: false },
      { fieldName: "anemia", fieldType: "BOOLEAN", required: false },
      { fieldName: "hyperthyroidism", fieldType: "BOOLEAN", required: false },
      { fieldName: "epilepsyOrSeizures", fieldType: "BOOLEAN", required: false },
      { fieldName: "mentalDisorder", fieldType: "BOOLEAN", required: false },
      { fieldName: "recentCovidVaccine", fieldType: "BOOLEAN", required: false },
      { fieldName: "recentHemorrhage", fieldType: "BOOLEAN", required: false },
      { fieldName: "physicalActivity", fieldType: "STRING", required: false },
      { fieldName: "pastSurgeries", fieldType: "STRING", required: false },
      { fieldName: "fractures", fieldType: "STRING", required: false },
      { fieldName: "smoking", fieldType: "BOOLEAN", required: false },
      { fieldName: "alcohol", fieldType: "BOOLEAN", required: false },
      { fieldName: "medications", fieldType: "STRING", required: false },
      { fieldName: "Circunferência - Direita", fieldType: "NUMBER", required: true },
      { fieldName: "Circunferência - Esquerda", fieldType: "NUMBER", required: true },
      { fieldName: "Força Muscular (F.M.) - Direita", fieldType: "NUMBER", required: true },
      { fieldName: "Força Muscular (F.M.) - Esquerda", fieldType: "NUMBER", required: true },
      { fieldName: "ADM - Direita", fieldType: "NUMBER", required: true },
      { fieldName: "ADM - Esquerda", fieldType: "NUMBER", required: true },
      { fieldName: "weight", fieldType: "NUMBER", required: false },
      { fieldName: "height", fieldType: "NUMBER", required: false },
      { fieldName: "heartRate", fieldType: "STRING", required: false },
      { fieldName: "respiratoryRate", fieldType: "STRING", required: false }
    ]
  },
  {
    id: 4,
    name: "Facial",
    fields: [
      { fieldName: "Queixa Principal", fieldType: "STRING", required: true },
      { fieldName: "painLevel", fieldType: "NUMBER", required: false },
      { fieldName: "date", fieldType: "DATE", required: true },
      { fieldName: "hmp", fieldType: "STRING", required: false },
      { fieldName: "hma", fieldType: "STRING", required: false },
      { fieldName: "associatedConditions", fieldType: "STRING", required: false },
      { fieldName: "allergy", fieldType: "BOOLEAN", required: false },
      { fieldName: "enzymeDeficiencyG6PD", fieldType: "BOOLEAN", required: false },
      { fieldName: "sinusitis", fieldType: "BOOLEAN", required: false },
      { fieldName: "rhinitis", fieldType: "BOOLEAN", required: false },
      { fieldName: "diabetesMellitus", fieldType: "BOOLEAN", required: false },
      { fieldName: "highBloodPressure", fieldType: "BOOLEAN", required: false },
      { fieldName: "cardiopathy", fieldType: "BOOLEAN", required: false },
      { fieldName: "anemia", fieldType: "BOOLEAN", required: false },
      { fieldName: "hyperthyroidism", fieldType: "BOOLEAN", required: false },
      { fieldName: "epilepsyOrSeizures", fieldType: "BOOLEAN", required: false },
      { fieldName: "mentalDisorder", fieldType: "BOOLEAN", required: false },
      { fieldName: "recentCovidVaccine", fieldType: "BOOLEAN", required: false },
      { fieldName: "recentHemorrhage", fieldType: "BOOLEAN", required: false },
      { fieldName: "physicalActivity", fieldType: "STRING", required: false },
      { fieldName: "pastSurgeries", fieldType: "STRING", required: false },
      { fieldName: "fractures", fieldType: "STRING", required: false },
      { fieldName: "smoking", fieldType: "BOOLEAN", required: false },
      { fieldName: "alcohol", fieldType: "BOOLEAN", required: false },
      { fieldName: "medications", fieldType: "STRING", required: false },
      { fieldName: "Tem algum problema de saúde? Qual?", fieldType: "STRING", required: false },
      { fieldName: "Ingestão de água. Quantos Litros no dia?", fieldType: "STRING", required: false },
      { fieldName: "Exposição ao sol e cuidados", fieldType: "STRING", required: false },
      { fieldName: "Uso de filtro solar (frequência e tipo)", fieldType: "STRING", required: false },
      { fieldName: "Lentes de contato?", fieldType: "STRING", required: false },
      { fieldName: "Cosméticos / dermocosméticos utilizados", fieldType: "STRING", required: false },
      { fieldName: "Tratamentos estéticos anteriores", fieldType: "STRING", required: false },
      { fieldName: "FEG (Gordurosa, Fibrosa, Flácida) - Em qual região?", fieldType: "STRING", required: false },
      { fieldName: "Flacidez (Tissular e Muscular) - Em qual região?", fieldType: "STRING", required: false },
      { fieldName: "Condições da pele (Cravos, Acne, Cicatriz, Manchas)", fieldType: "STRING", required: false },
      { fieldName: "O que você espera do tratamento?", fieldType: "STRING", required: false },
      { fieldName: "weight", fieldType: "NUMBER", required: false },
      { fieldName: "height", fieldType: "NUMBER", required: false },
      { fieldName: "heartRate", fieldType: "STRING", required: false },
      { fieldName: "respiratoryRate", fieldType: "STRING", required: false }
    ]
  },
  {
    id: 5,
    name: "Corporal",
    fields: [
      { fieldName: "Queixa Principal", fieldType: "STRING", required: true },
      { fieldName: "painLevel", fieldType: "NUMBER", required: false },
      { fieldName: "date", fieldType: "DATE", required: true },
      { fieldName: "hmp", fieldType: "STRING", required: false },
      { fieldName: "hma", fieldType: "STRING", required: false },
      { fieldName: "associatedConditions", fieldType: "STRING", required: false },
      { fieldName: "allergy", fieldType: "BOOLEAN", required: false },
      { fieldName: "enzymeDeficiencyG6PD", fieldType: "BOOLEAN", required: false },
      { fieldName: "sinusitis", fieldType: "BOOLEAN", required: false },
      { fieldName: "rhinitis", fieldType: "BOOLEAN", required: false },
      { fieldName: "diabetesMellitus", fieldType: "BOOLEAN", required: false },
      { fieldName: "highBloodPressure", fieldType: "BOOLEAN", required: false },
      { fieldName: "cardiopathy", fieldType: "BOOLEAN", required: false },
      { fieldName: "anemia", fieldType: "BOOLEAN", required: false },
      { fieldName: "hyperthyroidism", fieldType: "BOOLEAN", required: false },
      { fieldName: "epilepsyOrSeizures", fieldType: "BOOLEAN", required: false },
      { fieldName: "mentalDisorder", fieldType: "BOOLEAN", required: false },
      { fieldName: "recentCovidVaccine", fieldType: "BOOLEAN", required: false },
      { fieldName: "recentHemorrhage", fieldType: "BOOLEAN", required: false },
      { fieldName: "physicalActivity", fieldType: "STRING", required: false },
      { fieldName: "pastSurgeries", fieldType: "STRING", required: false },
      { fieldName: "fractures", fieldType: "STRING", required: false },
      { fieldName: "smoking", fieldType: "BOOLEAN", required: false },
      { fieldName: "alcohol", fieldType: "BOOLEAN", required: false },
      { fieldName: "medications", fieldType: "STRING", required: false },
      { fieldName: "Retenção de líquido", fieldType: "BOOLEAN", required: false },
      { fieldName: "Gordura Localizada (região)", fieldType: "STRING", required: false },
      { fieldName: "FEG (Edematosa/Gordurosa, Fibrótica, Flácida)", fieldType: "STRING", required: false },
      { fieldName: "Flacidez (Tissular e Muscular)", fieldType: "STRING", required: false },
      { fieldName: "Estria (região)", fieldType: "STRING", required: false },
      { fieldName: "Altura", fieldType: "STRING", required: false },
      { fieldName: "Peso", fieldType: "STRING", required: false },
      { fieldName: "Frequência Respiratória (FR)", fieldType: "STRING", required: false },
      { fieldName: "Frequência Cardíaca (FC)", fieldType: "STRING", required: false },
      { fieldName: "Abdomen", fieldType: "STRING", required: false },
      { fieldName: "Braço Direito", fieldType: "STRING", required: false },
      { fieldName: "Braço Esquerdo", fieldType: "STRING", required: false },
      { fieldName: "Tórax", fieldType: "STRING", required: false },
      { fieldName: "Cintura", fieldType: "STRING", required: false },
      { fieldName: "Flanco", fieldType: "STRING", required: false },
      { fieldName: "Quadril / Culote", fieldType: "STRING", required: false },
      { fieldName: "Coxa Sup. Direita", fieldType: "STRING", required: false },
      { fieldName: "Coxa Sup. Esquerda", fieldType: "STRING", required: false },
      { fieldName: "Coxa Inf. Direita", fieldType: "STRING", required: false },
      { fieldName: "Coxa Inf. Esquerda", fieldType: "STRING", required: false },
      { fieldName: "Peso", fieldType: "STRING", required: false },
      { fieldName: "Observações", fieldType: "STRING", required: false }
    ]
  },
  {
    id: 6,
    name: "Ozonioterapia",
    fields: [
      { fieldName: "Queixa Principal", fieldType: "STRING", required: true },
      { fieldName: "painLevel", fieldType: "NUMBER", required: false },
      { fieldName: "date", fieldType: "DATE", required: true },
      { fieldName: "hmp", fieldType: "STRING", required: false },
      { fieldName: "hma", fieldType: "STRING", required: false },
      { fieldName: "associatedConditions", fieldType: "STRING", required: false },
      { fieldName: "allergy", fieldType: "BOOLEAN", required: false },
      { fieldName: "enzymeDeficiencyG6PD", fieldType: "BOOLEAN", required: false },
      { fieldName: "sinusitis", fieldType: "BOOLEAN", required: false },
      { fieldName: "rhinitis", fieldType: "BOOLEAN", required: false },
      { fieldName: "diabetesMellitus", fieldType: "BOOLEAN", required: false },
      { fieldName: "highBloodPressure", fieldType: "BOOLEAN", required: false },
      { fieldName: "cardiopathy", fieldType: "BOOLEAN", required: false },
      { fieldName: "anemia", fieldType: "BOOLEAN", required: false },
      { fieldName: "hyperthyroidism", fieldType: "BOOLEAN", required: false },
      { fieldName: "epilepsyOrSeizures", fieldType: "BOOLEAN", required: false },
      { fieldName: "mentalDisorder", fieldType: "BOOLEAN", required: false },
      { fieldName: "recentCovidVaccine", fieldType: "BOOLEAN", required: false },
      { fieldName: "recentHemorrhage", fieldType: "BOOLEAN", required: false },
      { fieldName: "physicalActivity", fieldType: "STRING", required: false },
      { fieldName: "pastSurgeries", fieldType: "STRING", required: false },
      { fieldName: "fractures", fieldType: "STRING", required: false },
      { fieldName: "smoking", fieldType: "BOOLEAN", required: false },
      { fieldName: "alcohol", fieldType: "BOOLEAN", required: false },
      { fieldName: "medications", fieldType: "STRING", required: false },
      { fieldName: "Tipo de Alimentação", fieldType: "STRING", required: false },
      { fieldName: "Ingestão de Água (Copos/dia)", fieldType: "STRING", required: false },
      { fieldName: "Funcionamento Intestinal", fieldType: "STRING", required: false },
      { fieldName: "Sono/Repouso", fieldType: "STRING", required: false },
      { fieldName: "Sexualidade/Reprodução", fieldType: "STRING", required: false },
      { fieldName: "DUM", fieldType: "DATE", required: false },
      { fieldName: "Postura de Trabalho - Sentada (Horas)", fieldType: "STRING", required: false },
      { fieldName: "Postura de Trabalho - Em Pé (Horas)", fieldType: "STRING", required: false },
      { fieldName: "Tratamento com ozônio anterior - Qual via/conc.", fieldType: "STRING", required: false },
      { fieldName: "Tratamento estético anterior - Qual?", fieldType: "STRING", required: false },
      { fieldName: "Planejamento Semanal", fieldType: "STRING", required: false },
      { fieldName: "Observações", fieldType: "STRING", required: false },
      { fieldName: "weight", fieldType: "NUMBER", required: false },
      { fieldName: "height", fieldType: "NUMBER", required: false },
      { fieldName: "heartRate", fieldType: "STRING", required: false },
      { fieldName: "respiratoryRate", fieldType: "STRING", required: false }
    ]
  }
];

export default function TemplateStep({ onSubmit, treatmentInstanceId, patientId,initialValues = {} }) {
  const [selected, setSelected] = useState(initialValues.templateId || null);
  const [fields, setFields] = useState([]);
  const [answers, setAnswers] = useState(initialValues.answers || {});

  useEffect(() => {
    if (selected) {
      const template = TEMPLATES.find(t => t.id === Number(selected));
      if (template) {
        setFields(template.fields);
        setAnswers(initialValues.answers || {});
      }
    }
  }, [selected]);

  const handleAnswer = (fieldName, value) => {
    setAnswers((prev) => ({ ...prev, [fieldName]: value.toString() }));
  };

  const handleContinue = async () => {
    if (!selected || fields.some((f) => f.required && !answers[f.fieldName])) {
      return alert("Selecione o Tratamento e preencha os campos obrigatórios");
    }

    const token = localStorage.getItem("token");
    const payload = {
      patientId: patientId,
      templateId: Number(selected),
      treatmentDate: initialValues.treatmentDate || new Date().toISOString(),
      progress: initialValues.progress || [],
      data: answers
    };

    try {
      if (treatmentInstanceId) {
        await api.put(`/treatment-instance/${treatmentInstanceId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("/treatment-instance", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      onSubmit(selected, answers, treatmentInstanceId);
    } catch (err) {
      console.error("Erro ao salvar tratamento:", err);
      alert("Erro ao salvar tratamento.");
    }
  };

  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '24px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif'
  };
  const headerStyle = { marginBottom: '24px', textAlign: 'center' };
  const titleStyle = { fontSize: '28px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '8px' };
  const subtitleStyle = { fontSize: '16px', color: '#7f8c8d', marginBottom: '0' };
  const selectionCardStyle = { backgroundColor: '#f8f9fa', border: '2px solid #e9ecef', borderRadius: '8px', padding: '20px', marginBottom: '24px' };
  const selectStyle = { width: '100%', padding: '12px 16px', fontSize: '16px', border: '2px solid #ddd', borderRadius: '8px', backgroundColor: '#fff', cursor: 'pointer', marginBottom: '16px', outline: 'none', transition: 'border-color 0.3s ease' };
  const fieldsContainerStyle = { backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: '8px', padding: '20px', marginBottom: '24px' };
  const fieldsHeaderStyle = { fontSize: '20px', fontWeight: '600', color: '#2c3e50', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' };
  const fieldStyle = { marginBottom: '20px' };
  const labelStyle = { display: 'block', fontSize: '14px', fontWeight: '600', color: '#34495e', marginBottom: '8px' };
  const inputStyle = { width: '100%', padding: '12px 16px', fontSize: '16px', border: '2px solid #ddd', borderRadius: '6px', backgroundColor: '#fff', outline: 'none', transition: 'border-color 0.3s ease', boxSizing: 'border-box' };
  const continueButtonStyle = { backgroundColor: '#3498db', color: 'white', border: 'none', padding: '14px 32px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: '600', transition: 'background-color 0.3s ease', float: 'right' };
  const footerStyle = { borderTop: '1px solid #e9ecef', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' };
  const infoTextStyle = { fontSize: '14px', color: '#7f8c8d' };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>Selecione o Tratamento</h3>
        <p style={subtitleStyle}>Escolha um tratamento e preencha os campos</p>
      </div>

      <div style={selectionCardStyle}>
        <select
          onChange={(e) => setSelected(e.target.value)}
          value={selected || ""}
          style={{
            ...selectStyle,
            borderColor: selected ? '#27ae60' : '#ddd'
          }}
          onFocus={(e) => e.target.style.borderColor = '#3498db'}
          onBlur={(e) => e.target.style.borderColor = selected ? '#27ae60' : '#ddd'}
        >
          <option value="">-- Escolha um Tratamento --</option>
          {TEMPLATES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {fields.length > 0 && (
        <div style={fieldsContainerStyle}>
          <h4 style={fieldsHeaderStyle}>
            <span>📋</span>
            Preencha os Campos do Tratamento
          </h4>
          {fields.map((f, idx) => {
            const renderInput = (field) => {
              const currentValue = answers[field.fieldName] || "";
              const commonProps = {
                name: field.fieldName,
                value: currentValue,
                onChange: (e) => handleAnswer(field.fieldName, e.target.value),
                style: inputStyle,
                onFocus: (e) => e.target.style.borderColor = '#3498db',
                onBlur: (e) => e.target.style.borderColor = '#ddd'
              };
              switch (field.fieldType) {
                case "STRING": return <input type="text" placeholder={`Digite ${field.fieldName.toLowerCase()}...`} {...commonProps} />;
                case "NUMBER": return <input type="number" placeholder="Digite um número..." {...commonProps} />;
                case "DATE": return <input type="date" {...commonProps} />;
                case "BOOLEAN":
                  return (
                    <select {...commonProps}>
                      <option value="">-- Selecione --</option>
                      <option value="true">Sim</option>
                      <option value="false">Não</option>
                    </select>
                  );
                default: return null;
              }
            };
            return (
              <div key={f.fieldName + idx} style={fieldStyle}>
                <label style={labelStyle}>
                  {f.fieldName}
                  {f.required && <span style={{ color: '#e74c3c', marginLeft: '4px' }}>*</span>}
                </label>
                {renderInput(f)}
                {f.required && (
                  <small style={{ color: '#7f8c8d', fontSize: '12px' }}>
                    Este campo é obrigatório
                  </small>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div style={footerStyle}>
        <div style={infoTextStyle}>
          {selected ? (
            <span style={{ color: '#27ae60' }}>✓ Tratamento selecionado</span>
          ) : (
            "Selecione um tratamento para continuar"
          )}
        </div>
        <button
          onClick={handleContinue}
          style={{
            ...continueButtonStyle,
            backgroundColor: (!selected || fields.some((f) => f.required && !answers[f.fieldName]))
              ? '#bdc3c7' : '#3498db',
            cursor: (!selected || fields.some((f) => f.required && !answers[f.fieldName]))
              ? 'not-allowed' : 'pointer'
          }}
          onMouseOver={(e) => {
            if (!(!selected || fields.some((f) => f.required && !answers[f.fieldName]))) {
              e.target.style.backgroundColor = '#2980b9';
            }
          }}
          onMouseOut={(e) => {
            if (!(!selected || fields.some((f) => f.required && !answers[f.fieldName]))) {
              e.target.style.backgroundColor = '#3498db';
            }
          }}
        >
          Concluir Tratamento
        </button>
      </div>
    </div>
  );
}