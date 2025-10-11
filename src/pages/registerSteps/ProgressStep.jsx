import React from "react";
import api from "../../services/api";

export default function ProgressStep({ data = {}, onChange, patientId, onProgressSaved }) {
  const handleChange = (index, field, value) => {
    const updated = [...(data.items || [])];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ items: updated });
  };

  const addProgress = () => {
    onChange({
      items: [
        ...(data.items || []),
        { progressDate: new Date().toISOString().split("T")[0], description: "" },
      ],
    });
  };

  const removeProgress = (index) => {
    const updated = [...(data.items || [])];
    updated.splice(index, 1);
    onChange({ items: updated });
  };

  const handleSaveProgress = async () => {
    if (!patientId) {
      alert("ID do paciente não encontrado");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      const payload = (data.items || []).map(p => ({
        progressDate: p.progressDate,
        description: p.description
      }));

      await api.post(`/patient/progress/${patientId}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Progresso do paciente salvo com sucesso!");
      if (onProgressSaved) {
        onProgressSaved();
      }
    } catch (err) {
      console.error("Erro ao salvar progresso:", err);
      alert("Erro ao salvar progresso do paciente.");
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>📈 Progresso do Paciente</h3>

      {(data.items || []).map((p, idx) => (
        <div key={idx} style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardIndex}>Progresso - {idx + 1}</span>
            <button onClick={() => removeProgress(idx)} style={styles.removeBtn}>
              ✕ Remover
            </button>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Data</label>
            <input
              type="date"
              value={p.progressDate || ""}
              onChange={(e) => handleChange(idx, "progressDate", e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Descrição</label>
            <textarea
              value={p.description || ""}
              onChange={(e) => handleChange(idx, "description", e.target.value)}
              style={{ ...styles.input, minHeight: "80px", resize: "vertical" }}
            />
          </div>
        </div>
      ))}

      <button onClick={addProgress} style={styles.addBtn}>
        + Adicionar Progresso
      </button>

      {(data.items || []).length > 0 && (
        <button onClick={handleSaveProgress} style={styles.saveBtn}>
          💾 Salvar Progresso do Paciente
        </button>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Segoe UI, sans-serif",
  },
  title: {
    color: "#025C4A",
    fontWeight: "600",
    fontSize: "1.4rem",
    marginBottom: "1rem",
  },
  card: {
    backgroundColor: "#F9F9F9",
    border: "1px solid #E0E0E0",
    padding: "1.2rem",
    borderRadius: "12px",
    marginBottom: "1.5rem",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  cardIndex: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#037E63",
  },
  removeBtn: {
    backgroundColor: "#FF4D4F",
    border: "none",
    color: "#fff",
    padding: "0.3rem 0.8rem",
    borderRadius: "6px",
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "1rem",
  },
  label: {
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "#333",
    marginBottom: "0.4rem",
  },
  input: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "0.5rem 0.8rem",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.2s ease",
  },
  addBtn: {
    backgroundColor: "#037E63",
    border: "none",
    color: "#fff",
    padding: "0.6rem 1.2rem",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background-color 0.2s ease",
    marginRight: "8px",
  },
  saveBtn: {
    backgroundColor: "#27ae60",
    border: "none",
    color: "#fff",
    padding: "0.6rem 1.2rem",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background-color 0.2s ease",
  },
};