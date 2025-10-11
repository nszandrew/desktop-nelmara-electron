import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { TEMPLATES } from "../../utils/Templates";

export default function TemplateStep({ onSubmit, patientId, initialValues = {}, existingTreatments = [] }) {
  const [treatments, setTreatments] = useState(() => {
    if (existingTreatments && existingTreatments.length > 0) {
      return existingTreatments.map(t => ({
        templateId: t.templateId || TEMPLATES.find(tmpl => tmpl.name === t.name)?.id,
        treatmentDate: t.treatmentDate,
        progress: t.progress || [],
        data: t.data || {}
      }));
    }
    return [];
  });
  
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [currentAnswers, setCurrentAnswers] = useState({});
  const [currentProgress, setCurrentProgress] = useState([]);
  const [currentFields, setCurrentFields] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    if (currentTemplate) {
      const template = TEMPLATES.find(t => t.id === Number(currentTemplate));
      if (template) {
        setCurrentFields(template.fields);
      }
    }
  }, [currentTemplate]);

  const handleAnswer = (fieldName, value) => {
    setCurrentAnswers(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleAddProgress = () => {
    setCurrentProgress([
      ...currentProgress,
      { progressDate: new Date().toISOString().split('T')[0], description: '' }
    ]);
  };

  const handleRemoveProgress = (index) => {
    setCurrentProgress(currentProgress.filter((_, i) => i !== index));
  };

  const handleChangeProgress = (index, field, value) => {
    const updated = [...currentProgress];
    updated[index] = { ...updated[index], [field]: value };
    setCurrentProgress(updated);
  };

  const handleAddTreatment = () => {
    if (!currentTemplate || currentFields.some(f => f.required && !currentAnswers[f.fieldName])) {
      return alert("Selecione o Tratamento e preencha os campos obrigatórios");
    }

    const dataTyped = {};
    currentFields.forEach(f => {
      const val = currentAnswers[f.fieldName];
      if (val === "" || val === undefined || val === null) {
        dataTyped[f.fieldName] = null;
      } else {
        switch (f.fieldType) {
          case "NUMBER":
            dataTyped[f.fieldName] = Number(val);
            break;
          case "BOOLEAN":
            dataTyped[f.fieldName] = val;
            break;
          case "DATE":
            dataTyped[f.fieldName] = val ? val.split('T')[0] : null;
            break;
          default:
            dataTyped[f.fieldName] = val;
        }
      }
    });

    const newTreatment = {
      templateId: Number(currentTemplate),
      treatmentDate: new Date().toISOString(),
      progress: currentProgress,
      data: dataTyped
    };

    if (editingIndex !== null) {
      const updated = [...treatments];
      updated[editingIndex] = newTreatment;
      setTreatments(updated);
      setEditingIndex(null);
    } else {
      setTreatments([...treatments, newTreatment]);
    }

    setCurrentTemplate(null);
    setCurrentAnswers({});
    setCurrentProgress([]);
    setCurrentFields([]);
  };

  const handleEditTreatment = (index) => {
    const treatment = treatments[index];
    setCurrentTemplate(treatment.templateId);
    setCurrentAnswers(treatment.data);
    setCurrentProgress(treatment.progress || []);
    setEditingIndex(index);

    const template = TEMPLATES.find(t => t.id === treatment.templateId);
    if (template) {
      setCurrentFields(template.fields);
    }
  };

  const handleRemoveTreatment = (index) => {
    setTreatments(treatments.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setCurrentTemplate(null);
      setCurrentAnswers({});
      setCurrentProgress([]);
      setCurrentFields([]);
    }
  };

  const handleSubmitAll = async () => {
    if (treatments.length === 0) {
      return alert("Adicione pelo menos um tratamento");
    }

    const token = localStorage.getItem("token");

    try {
      const postPayload = treatments.map(t => ({
        patientId: Number(patientId),
        templateId: t.templateId,
        treatmentDate: t.treatmentDate,
        progress: t.progress,
        data: t.data
      }));

      await api.post("/treatment-instance/multiple", postPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      onSubmit(treatments);
    } catch (err) {
      console.error("Erro ao salvar tratamentos:", err);
      alert("Erro ao salvar tratamentos. Por favor tente novamente.");
    }
  };

  const renderInput = (field) => {
    const currentValue = currentAnswers[field.fieldName] || "";
    const commonProps = {
      name: field.fieldName,
      value: currentValue,
      onChange: (e) => handleAnswer(field.fieldName, e.target.value),
      style: inputStyle,
      onFocus: (e) => e.target.style.borderColor = '#3498db',
      onBlur: (e) => e.target.style.borderColor = '#ddd'
    };

    switch (field.fieldType) {
      case "STRING":
        return <input type="text" placeholder={`Digite ${field.fieldName.toLowerCase()}...`} {...commonProps} />;
      case "NUMBER":
        return <input type="number" placeholder="Digite um número..." {...commonProps} />;
      case "DATE":
        return <input type="date" {...commonProps} />;
      case "BOOLEAN": {
        const currentValue = currentAnswers[field.fieldName] || { checked: null, note: "" };
        return (
          <div>
            <select
              value={currentValue.checked === null ? "" : currentValue.checked ? "true" : "false"}
              onChange={(e) => {
                const checked = e.target.value === "" ? null : e.target.value === "true";
                handleAnswer(field.fieldName, { checked, note: checked ? currentValue.note : "" });
              }}
              style={inputStyle}
            >
              <option value="">-- Selecione --</option>
              <option value="true">Sim</option>
              <option value="false">Não</option>
            </select>
            {currentValue.checked === true && (
              <input
                type="text"
                placeholder="Descreva aqui..."
                value={currentValue.note}
                onChange={(e) => handleAnswer(field.fieldName, { checked: true, note: e.target.value })}
                style={{ ...inputStyle, marginTop: "8px" }}
              />
            )}
          </div>
        );
      }
      default:
        return null;
    }
  };

  const containerStyle = {
    maxWidth: '900px',
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
  const fieldsHeaderStyle = { fontSize: '18px', fontWeight: '600', color: '#2c3e50', marginBottom: '16px', marginTop: '20px' };
  const fieldStyle = { marginBottom: '16px' };
  const labelStyle = { display: 'block', fontSize: '14px', fontWeight: '600', color: '#34495e', marginBottom: '8px' };
  const inputStyle = { width: '100%', padding: '12px 16px', fontSize: '16px', border: '2px solid #ddd', borderRadius: '6px', backgroundColor: '#fff', outline: 'none', transition: 'border-color 0.3s ease', boxSizing: 'border-box' };

  const buttonStyle = { backgroundColor: '#3498db', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', marginRight: '8px', transition: 'background-color 0.3s ease' };
  const removeButtonStyle = { ...buttonStyle, backgroundColor: '#e74c3c' };
  const submitButtonStyle = { ...buttonStyle, backgroundColor: '#27ae60', padding: '14px 32px', fontSize: '16px' };

  const treatmentListStyle = { backgroundColor: '#ecf0f1', border: '1px solid #bdc3c7', borderRadius: '8px', padding: '16px', marginBottom: '24px' };
  const treatmentItemStyle = { backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '6px', padding: '12px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };

  const footerStyle = { borderTop: '1px solid #e9ecef', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' };

  const progressCardStyle = { backgroundColor: '#fff3cd', border: '1px solid #ffc107', borderRadius: '6px', padding: '12px', marginBottom: '12px' };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>Múltiplos Tratamentos</h3>
        <p style={subtitleStyle}>Adicione e configure tratamentos com seus respectivos progresses</p>
      </div>

      {treatments.length > 0 && (
        <div style={treatmentListStyle}>
          <h4 style={{ marginTop: 0, marginBottom: '12px', color: '#2c3e50' }}>Tratamentos Adicionados ({treatments.length})</h4>
          {treatments.map((t, idx) => {
            const template = TEMPLATES.find(tmpl => tmpl.id === t.templateId);
            return (
              <div key={idx} style={treatmentItemStyle}>
                <div>
                  <strong>{template?.name}</strong>
                  <small style={{ display: 'block', color: '#7f8c8d', marginTop: '4px' }}>
                    {t.progress.length} progresso(s) - {new Date(t.treatmentDate).toLocaleDateString('pt-BR')}
                  </small>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleEditTreatment(idx)}
                    style={{
                      ...buttonStyle,
                      backgroundColor: editingIndex === idx ? '#f39c12' : '#3498db'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = editingIndex === idx ? '#e67e22' : '#2980b9'}
                    onMouseOut={(e) => e.target.style.backgroundColor = editingIndex === idx ? '#f39c12' : '#3498db'}
                  >
                    {editingIndex === idx ? 'Editando' : 'Editar'}
                  </button>
                  <button
                    onClick={() => handleRemoveTreatment(idx)}
                    style={removeButtonStyle}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#c0392b'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#e74c3c'}
                  >
                    Remover
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={selectionCardStyle}>
        <h4 style={{ marginTop: 0, marginBottom: '16px', color: '#2c3e50' }}>Novo Tratamento</h4>
        <select
          onChange={(e) => setCurrentTemplate(e.target.value)}
          value={currentTemplate || ""}
          style={{
            ...selectStyle,
            borderColor: currentTemplate ? '#27ae60' : '#ddd'
          }}
          onFocus={(e) => e.target.style.borderColor = '#3498db'}
          onBlur={(e) => e.target.style.borderColor = currentTemplate ? '#27ae60' : '#ddd'}
        >
          <option value="">-- Escolha um Tratamento --</option>
          {TEMPLATES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {currentFields.length > 0 && (
        <div style={fieldsContainerStyle}>
          <h4 style={fieldsHeaderStyle}>📋 Dados do Tratamento</h4>
          {currentFields.map((f, idx) => (
            <div key={f.fieldName + idx} style={fieldStyle}>
              <label style={labelStyle}>
                {f.label || f.fieldName}
                {f.required && <span style={{ color: '#e74c3c', marginLeft: '4px' }}>*</span>}
              </label>
              {renderInput(f)}
            </div>
          ))}

          <h4 style={fieldsHeaderStyle}>📈 Progresso</h4>
          
          {currentProgress.map((p, idx) => (
            <div key={`progress-${idx}`} style={progressCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontWeight: '600', color: '#856404' }}>Etapa {idx + 1}</span>
                <button
                  onClick={() => handleRemoveProgress(idx)}
                  style={{ ...removeButtonStyle, padding: '4px 8px', fontSize: '12px', marginRight: 0 }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#c0392b'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#e74c3c'}
                >
                  ✕
                </button>
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Data do Progresso</label>
                <input
                  type="date"
                  value={p.progressDate || ''}
                  onChange={(e) => handleChangeProgress(idx, 'progressDate', e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Descrição</label>
                <textarea
                  value={p.description || ''}
                  onChange={(e) => handleChangeProgress(idx, 'description', e.target.value)}
                  style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                />
              </div>
            </div>
          ))}

          <button
            onClick={handleAddProgress}
            style={{
              ...buttonStyle,
              backgroundColor: '#17a2b8',
              marginBottom: '16px'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#138496'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#17a2b8'}
          >
            + Adicionar Progresso
          </button>

          <button
            onClick={handleAddTreatment}
            style={{
              ...submitButtonStyle,
              backgroundColor: (!currentTemplate || currentFields.some((f) => f.required && !currentAnswers[f.fieldName])) ? '#bdc3c7' : '#27ae60',
              cursor: (!currentTemplate || currentFields.some((f) => f.required && !currentAnswers[f.fieldName])) ? 'not-allowed' : 'pointer'
            }}
            onMouseOver={(e) => {
              if (!(!currentTemplate || currentFields.some((f) => f.required && !currentAnswers[f.fieldName]))) {
                e.target.style.backgroundColor = '#229954';
              }
            }}
            onMouseOut={(e) => {
              if (!(!currentTemplate || currentFields.some((f) => f.required && !currentAnswers[f.fieldName]))) {
                e.target.style.backgroundColor = '#27ae60';
              }
            }}
          >
            {editingIndex !== null ? 'Salvar Alterações' : 'Adicionar Tratamento'}
          </button>
        </div>
      )}

      <div style={footerStyle}>
        <div style={{ fontSize: '14px', color: '#7f8c8d' }}>
          {treatments.length > 0 ? (
            <span style={{ color: '#27ae60' }}>✓ {treatments.length} tratamento(s)</span>
          ) : (
            "Adicione pelo menos um tratamento"
          )}
        </div>
        <button
          onClick={handleSubmitAll}
          style={{
            ...submitButtonStyle,
            backgroundColor: treatments.length === 0 ? '#bdc3c7' : '#27ae60',
            cursor: treatments.length === 0 ? 'not-allowed' : 'pointer'
          }}
          onMouseOver={(e) => {
            if (treatments.length > 0) {
              e.target.style.backgroundColor = '#229954';
            }
          }}
          onMouseOut={(e) => {
            if (treatments.length > 0) {
              e.target.style.backgroundColor = '#27ae60';
            }
          }}
        >
          Enviar Tratamentos
        </button>
      </div>
    </div>
  );
}