import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function TemplateStep({ onSubmit, treatmentInstanceId, initialValues = {} }) {
  const [templates, setTemplates] = useState([]);
  const [selected, setSelected] = useState(initialValues.templateId || null);
  const [fields, setFields] = useState([]);
  const [answers, setAnswers] = useState(initialValues.answers || {});

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/templates/getall?page=0&size=100", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTemplates(res.data);
        console.log(res)
      } catch (err) {
        console.error("Erro ao buscar Tratamentos:", err);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    if (selected) {
      const fetchFields = async () => {
        try {
          const token = localStorage.getItem("token");
          
          // Se o selected veio dos initialValues, é um tratamento já associado ao paciente
          // Se foi selecionado da lista, é um template novo
          const isExistingInstance = initialValues.templateId && selected === initialValues.templateId;
          
          let res;
          if (isExistingInstance) {
            // Tratamento já associado ao paciente
            res = await api.get(`/treatment-instances/${selected}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            
            // Estrutura diferente para instâncias existentes
            if (res.data && res.data.data) {
              const dataFields = Object.keys(res.data.data).map(key => {
                const value = res.data.data[key];
                let fieldType = "STRING";
                
                // Detectar o tipo baseado no valor
                if (value === "true" || value === "false" || value === true || value === false) {
                  fieldType = "BOOLEAN";
                } else if (!isNaN(value) && value !== "" && value !== null) {
                  fieldType = "NUMBER";
                } else if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
                  fieldType = "DATE";
                }
                
                return {
                  fieldName: key,
                  fieldType: fieldType,
                  required: false
                };
              });
              setFields(dataFields);
              setAnswers(res.data.data);
            } else {
              setFields([]);
            }
          } else {
            // Template novo da lista
            res = await api.get(`/template/${selected}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            
            // Estrutura padrão para templates
            if (res.data && res.data.fields) {
              setFields(res.data.fields);
              setAnswers({}); // Limpar respostas para novo template
            } else {
              setFields([]);
            }
          }
        } catch (err) {
          console.error("Erro ao buscar campos do tratamento:", err);
          setFields([]);
        }
      };
      fetchFields();
    }
  }, [selected, initialValues.templateId]);

  const handleAnswer = (fieldName, value) => {
    setAnswers((prev) => ({ ...prev, [fieldName]: value.toString() }));
  };

  const handleContinue = () => {
    if (!selected || fields.some((f) => f.required && !answers[f.fieldName])) {
      return alert("Selecione o Tratamento e preencha os campos obrigatórios");
    }
    onSubmit(selected, answers, treatmentInstanceId);
  };

  const handleCreateTreatment = () => {
    window.location.href = '/treatments';
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

  const headerStyle = {
    marginBottom: '24px',
    textAlign: 'center'
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '8px'
  };

  const subtitleStyle = {
    fontSize: '16px',
    color: '#7f8c8d',
    marginBottom: '0'
  };

  const selectionCardStyle = {
    backgroundColor: '#f8f9fa',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '24px'
  };

  const selectStyle = {
    width: '100%',
    padding: '12px 16px',
    fontSize: '16px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    marginBottom: '16px',
    outline: 'none',
    transition: 'border-color 0.3s ease'
  };

  const createButtonStyle = {
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px'
  };

  const fieldsContainerStyle = {
    backgroundColor: '#f8f9fa',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '24px'
  };

  const fieldsHeaderStyle = {
    fontSize: '20px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const fieldStyle = {
    marginBottom: '20px'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#34495e',
    marginBottom: '8px'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    fontSize: '16px',
    border: '2px solid #ddd',
    borderRadius: '6px',
    backgroundColor: '#fff',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    boxSizing: 'border-box'
  };

  const continueButtonStyle = {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '14px 32px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'background-color 0.3s ease',
    float: 'right'
  };

  const footerStyle = {
    borderTop: '1px solid #e9ecef',
    paddingTop: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px'
  };

  const infoTextStyle = {
    fontSize: '14px',
    color: '#7f8c8d'
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h3 style={titleStyle}>Selecione o Tratamento</h3>
        <p style={subtitleStyle}>Escolha um tratamento existente ou crie um novo</p>
      </div>

      {/* Selection Card */}
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
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <div style={{ textAlign: 'center' }}>
          <small style={{ color: '#7f8c8d', marginRight: '12px' }}>
            Não encontrou o que procura?
          </small>
          <button
            onClick={handleCreateTreatment}
            style={createButtonStyle}
            onMouseOver={(e) => e.target.style.backgroundColor = '#229954'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#27ae60'}
          >
            <span>+</span>
            Criar Novo Tratamento
          </button>
        </div>
      </div>

      {/* Dynamic Fields */}
      {fields.length > 0 && (
        <div style={fieldsContainerStyle}>
          <h4 style={fieldsHeaderStyle}>
            <span>📋</span>
            Preencha os Campos do Tratamento
          </h4>
          
          {fields.map((f) => {
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
                case "STRING":
                  return <input type="text" placeholder={`Digite ${field.fieldName.toLowerCase()}...`} {...commonProps} />;
                case "NUMBER":
                  return <input type="number" placeholder="Digite um número..." {...commonProps} />;
                case "DATE":
                  return <input type="date" {...commonProps} />;
                case "BOOLEAN":
                  return (
                    <select {...commonProps}>
                      <option value="">-- Selecione --</option>
                      <option value="true">Sim</option>
                      <option value="false">Não</option>
                    </select>
                  );
                default:
                  return null;
              }
            };

            return (
              <div key={f.fieldName} style={fieldStyle}>
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

      {/* Footer */}
      <div style={footerStyle}>
        <div style={infoTextStyle}>
          {selected ? (
            <span style={{ color: '#27ae60' }}>
              ✓ Tratamento selecionado
            </span>
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