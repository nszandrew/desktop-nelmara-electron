import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { TEMPLATES } from "../../utils/Templates";
import ProgressStep from "./ProgressStep";

export default function TemplateStep({ onSubmit, treatmentInstanceId, patientId, initialValues = {} }) {
  const [selected, setSelected] = useState(initialValues.templateId || null);
  const [fields, setFields] = useState([]);
  const [answers, setAnswers] = useState(initialValues.answers || {});
  const [progress, setProgress] = useState(initialValues.progress || []);

  useEffect(() => {
    if (initialValues.templateId) {
      setSelected(initialValues.templateId);
      setAnswers(initialValues.answers || {});
    }
  }, [initialValues]);

  // carrega os fields do template assim que selected mudar
  useEffect(() => {
    if (selected) {
      const template = TEMPLATES.find(t => t.id === Number(selected));
      if (template) {
        setFields(template.fields);
      }
    }
  }, [selected]);

  const handleAnswer = (fieldName, value) => {
    setAnswers(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleContinue = async () => {
    if (!selected || fields.some(f => f.required && !answers[f.fieldName])) {
      return alert("Selecione o Tratamento e preencha os campos obrigatórios");
    }

    // converte tipos corretamente antes de enviar
    const dataTyped = {};
    fields.forEach(f => {
      const val = answers[f.fieldName];
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

    const token = localStorage.getItem("token");
    const payload = {
      patientId: patientId,
      templateId: Number(selected),
      treatmentDate: initialValues.treatmentDate || new Date().toISOString(),
      progress: progress,
      data: dataTyped
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
                case "BOOLEAN": {
                  const currentValue = answers[field.fieldName] || { checked: null, note: "" };

                  return (
                    <div>
                      <select
                        value={
                          currentValue.checked === null
                            ? ""
                            : currentValue.checked
                              ? "true"
                              : "false"
                        }
                        onChange={(e) => {
                          const checked =
                            e.target.value === ""
                              ? null
                              : e.target.value === "true";

                          handleAnswer(field.fieldName, {
                            checked,
                            note: checked ? currentValue.note : ""
                          });
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
                          onChange={(e) =>
                            handleAnswer(field.fieldName, {
                              checked: true,
                              note: e.target.value
                            })
                          }
                          style={{ ...inputStyle, marginTop: "8px" }}
                        />
                      )}
                    </div>
                  );
                }
              }
            };
            return (
              <div key={f.fieldName + idx} style={fieldStyle}>
                <label style={labelStyle}>
                  {f.label || f.fieldName}
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