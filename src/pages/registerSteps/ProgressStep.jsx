import React from "react";

export default function ProgressStep({ data = {}, onChange }) {
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

  return (
    <div>
      <h3>📈 Progresso do Paciente</h3>
      {(data.items || []).map((p, idx) => (
        <div
          key={idx}
          style={{
            border: "1px solid #ddd",
            padding: "1rem",
            marginBottom: "1rem",
            borderRadius: "8px",
          }}
        >
          <label>
            Data do progresso:
            <input
              type="date"
              value={p.progressDate || ""}
              onChange={(e) => handleChange(idx, "progressDate", e.target.value)}
            />
          </label>
          <label>
            Descrição:
            <textarea
              value={p.description || ""}
              onChange={(e) => handleChange(idx, "description", e.target.value)}
            />
          </label>
          <button onClick={() => removeProgress(idx)} style={{ backgroundColor: "red", color: "#fff" }}>
            Remover
          </button>
        </div>
      ))}

      <button
        onClick={addProgress}
        style={{ backgroundColor: "green", color: "#fff", padding: "0.5rem 1rem", borderRadius: "4px" }}
      >
        + Adicionar Progresso
      </button>
    </div>
  );
}
