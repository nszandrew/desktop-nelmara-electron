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
        console.error("Erro ao buscar templates:", err);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    if (selected) {
      const fetchFields = async () => {
        const token = localStorage.getItem("token");
        const res = await api.get(`/template/${selected}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFields(res.data.fields);
      };
      fetchFields();
    }
  }, [selected]);

  const handleAnswer = (fieldName, value) => {
    setAnswers((prev) => ({ ...prev, [fieldName]: value.toString() }));
  };

  const handleContinue = () => {
    if (!selected || fields.some((f) => f.required && !answers[f.fieldName])) {
      return alert("Selecione o template e preencha os campos obrigatórios");
    }
    onSubmit(selected, answers, treatmentInstanceId);
  };

  return (
    <div>
      <h3>Selecione o Template</h3>
      <select
        onChange={(e) => setSelected(e.target.value)}
        value={selected || ""}
      >
        <option value="">-- Escolha um template --</option>
        {templates.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      {fields.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          {fields.map((f) => {
            const renderInput = (field) => {
              const commonProps = {
                name: field.fieldName,
                onChange: (e) => handleAnswer(field.fieldName, e.target.value),
                style: {
                  marginBottom: "1rem",
                  padding: "0.5rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                },
              };

              switch (field.fieldType) {
                case "STRING":
                  return <input type="text" {...commonProps} />;
                case "NUMBER":
                  return <input type="number" {...commonProps} />;
                case "DATE":
                  return <input type="date" {...commonProps} />;
                case "BOOLEAN":
                  return (
                    <select {...commonProps}>
                      <option value="">--</option>
                      <option value="true">Sim</option>
                      <option value="false">Não</option>
                    </select>
                  );
                default:
                  return null;
              }
            };

            return (
              <div key={f.fieldName}>
                <label>
                  {f.fieldName} {f.required && "*"}
                  <br />
                  {renderInput(f)}
                </label>
              </div>
            );
          })}
        </div>
      )}

      <button onClick={handleContinue}>Concluir Template</button>
    </div>
  );
}
