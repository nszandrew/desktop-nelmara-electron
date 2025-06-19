import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";
import { FaPlus, FaTrash, FaRegQuestionCircle, FaArrowLeft } from "react-icons/fa";

export default function EditTreatmentTemplate() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchTemplate = async () => {
      const token = localStorage.getItem("token");
      const res = await api.get(`/template/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setName(res.data.name);
      setDescription(res.data.description);
      setQuestions(
        res.data.fields.map((field) => ({
          text: field.fieldName,
          type: field.fieldType,
          required: field.required,
        }))
      );
    };
    fetchTemplate();
  }, [id]);

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const toggleRequired = (index) => {
    const updated = [...questions];
    updated[index].required = !updated[index].required;
    setQuestions(updated);
  };

  const removeQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([...questions, { text: "", type: "STRING", required: true }]);
  };

  const handleSubmit = async () => {
    if (!name || !description || questions.length === 0) {
      alert("Preencha todos os campos e adicione pelo menos uma pergunta.");
      return;
    }

    const payload = {
      name,
      description,
      fields: questions.map((q) => ({
        fieldName: q.text,
        fieldType: q.type,
        required: q.required,
      })),
    };

    try {
      const token = localStorage.getItem("token");
      await api.put(`/template/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Template atualizado com sucesso!");
      navigate("/treatments");
    } catch (err) {
      console.error("Erro ao atualizar template:", err);
      alert("Erro ao atualizar template.");
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#025C4A" }}>
      <Sidebar />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ flex: 1, padding: "3rem 2rem", fontFamily: "Segoe UI, sans-serif", marginLeft: "100px" }}
      >
        <div style={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={styles.title}>✏️ Editar Template de Tratamento</h2>
            <button onClick={() => navigate("/treatments")} style={styles.backBtn}>
              <FaArrowLeft /> Voltar
            </button>
          </div>

          <input
            type="text"
            placeholder="Nome do Template *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />

          <textarea
            placeholder="Descrição *"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ ...styles.input, resize: "none" }}
          />

          <div style={{ marginTop: "1.5rem" }}>
            <h3 style={{ marginBottom: "1rem", color: "#025C4A" }}>
              <FaRegQuestionCircle /> Perguntas
            </h3>
            {questions.map((q, idx) => (
              <div key={idx} style={styles.questionBox}>
                <input
                  type="text"
                  placeholder="Texto da pergunta *"
                  value={q.text}
                  onChange={(e) => updateQuestion(idx, "text", e.target.value)}
                  style={{ ...styles.input, marginBottom: "0.5rem" }}
                />
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <select
                    value={q.type}
                    onChange={(e) => updateQuestion(idx, "type", e.target.value)}
                    style={{ ...styles.input, flex: 1 }}
                  >
                    <option value="STRING">Texto</option>
                    <option value="NUMBER">Número</option>
                    <option value="BOOLEAN">Sim/Não (Checkbox)</option>
                    <option value="DATE">Data</option>
                  </select>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <input
                      type="checkbox"
                      checked={q.required}
                      onChange={() => toggleRequired(idx)}
                    />
                    Obrigatória
                  </label>
                </div>
                <button onClick={() => removeQuestion(idx)} style={styles.removeBtn}>
                  <FaTrash /> Remover
                </button>
              </div>
            ))}
            <button onClick={addQuestion} style={styles.addBtn}>
              <FaPlus /> Adicionar Pergunta
            </button>
          </div>

          <div style={{ marginTop: "2rem", textAlign: "right" }}>
            <button onClick={handleSubmit} style={styles.saveBtn}>
              💾 Salvar Alterações
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const styles = {
  card: {
    maxWidth: "900px",
    margin: "0 auto",
    background: "#fff",
    borderRadius: "20px",
    padding: "2.5rem",
    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
  },
  title: {
    color: "#025C4A",
    marginBottom: "1.5rem",
    fontSize: "1.8rem",
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
  },
  input: {
    width: "100%",
    padding: "0.8rem",
    marginBottom: "1rem",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "1rem",
  },
  questionBox: {
    backgroundColor: "#f9f9f9",
    padding: "1rem",
    borderRadius: "10px",
    marginBottom: "1rem",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  },
  addBtn: {
    padding: "0.6rem 1rem",
    backgroundColor: "#00C9A7",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  removeBtn: {
    marginTop: "0.5rem",
    backgroundColor: "#d3d3d3",
    border: "none",
    borderRadius: "6px",
    padding: "0.4rem 0.8rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  saveBtn: {
    padding: "0.7rem 1.5rem",
    backgroundColor: "#037E63",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  backBtn: {
    padding: "0.5rem 1rem",
    backgroundColor: "#cccccc",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    cursor: "pointer",
  },
};
