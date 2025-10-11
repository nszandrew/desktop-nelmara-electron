// src/pages/ViewPatientPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { motion } from "framer-motion";
import {
  FaUser,
  FaHeartbeat,
  FaStethoscope,
  FaRunning,
  FaEdit,
  FaArrowLeft,
  FaChartLine,
} from "react-icons/fa";
import { TEMPLATES } from "../utils/Templates";

export default function ViewPatientPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    if (isPrinting) {
      const timeout = setTimeout(() => {
        window.print();
        setIsPrinting(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isPrinting]);

  const estiloBase = {
    minHeight: "100vh",
    padding: "3rem 1rem",
    backgroundColor: "#025C4A",
    fontFamily: "Segoe UI, sans-serif",
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const res = await api.get(`/patient/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
    @media print {
      body {
        background-color: white !important;
        font-size: 12pt !important;
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        margin: 0 !important;
      }
      button, nav, .no-print {
        display: none !important;
      }
      section {
        page-break-inside: avoid;
        break-inside: avoid;
      }
      * {
        box-shadow: none !important;
        background: none !important;
        color: #000 !important;
      }
      html, body, div {
        background-color: white !important;
      }
    }
  `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (!data)
    return <p style={{ textAlign: "center", color: "#fff" }}>Carregando...</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={estiloBase}
    >
      {renderContent(data, navigate, () => setIsPrinting(true))}
    </motion.div>
  );
}

function renderContent(data, navigate, triggerPrint = () => window.print()) {
  const sectionStyle = {
    marginBottom: "2rem",
    padding: "1.5rem",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  };

  const titleStyle = {
    display: "flex",
    alignItems: "center",
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#025C4A",
    marginBottom: "1rem",
    gap: "0.6rem",
  };

  const progressCard = {
    backgroundColor: "#F9F9F9",
    border: "1px solid #E0E0E0",
    borderRadius: "10px",
    padding: "1rem",
    marginBottom: "1rem",
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        background: "#fff",
        borderRadius: "20px",
        padding: "2.5rem",
        boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
      }}
    >
      <div
        className="no-print"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "2rem",
        }}
      >
        <button onClick={() => navigate("/")} style={btn("gray")}>
          <FaArrowLeft /> Voltar
        </button>
        <button onClick={triggerPrint} style={btn("blue")}>
          🖨️ Imprimir
        </button>
        <button onClick={() => navigate(`/edit-patient/${data.id}`)} style={btn("green")}>
          <FaEdit /> Editar
        </button>
      </div>

      <section style={sectionStyle}>
        <div style={titleStyle}>
          <FaUser /> Dados Pessoais
        </div>
        <p><strong>Nome:</strong> {data.fullName}</p>
        <p><strong>CPF:</strong> {data.cpf}</p>
        <p><strong>Email:</strong> {data.email}</p>
        <p><strong>Telefone:</strong> {data.phone}</p>
        <p><strong>Gênero:</strong> {data.gender}</p>
        <p><strong>Data de Nascimento:</strong> {formatDate(data.dateOfBirth)}</p>
        <p><strong>Profissão:</strong> {data.profession}</p>
        <p><strong>Indicação:</strong> {data.indication}</p>
        <p><strong>Endereço:</strong> {data.address}</p>
      </section>

      {Array.isArray(data.treatmentInstance) &&
        data.treatmentInstance.length > 0 &&
        data.treatmentInstance.map((treatment, tIdx) => (
          <section key={tIdx} style={sectionStyle}>
            <div style={titleStyle}>
              <FaStethoscope /> Tratamento - {treatment.name}
            </div>

            <p>
              <strong>Nome do Tratamento:</strong> {treatment.name}
            </p>
            <p>
              <strong>Data do Tratamento:</strong> {formatDate(treatment.treatmentDate)}
            </p>

            <div style={{ marginTop: "1rem" }}>
              {Object.entries(treatment.data || {}).map(([key, value]) => (
                <p key={key}>
                  <strong>{formatKey(key)}:</strong>{" "}
                  {typeof value === "object" && value !== null && "checked" in value
                    ? `${value.checked ? "Sim" : "Não"}${value.note ? ` - ${value.note}` : ""}`
                    : String(value)}
                </p>
              ))}
            </div>

            {Array.isArray(treatment.progress) && treatment.progress.length > 0 && (
              <div style={{ marginTop: "1.5rem" }}>
                <div style={{ ...titleStyle, fontSize: "1rem" }}>
                  <FaChartLine /> Progresso do Tratamento
                </div>
                {treatment.progress.map((p, idx) => (
                  <div key={idx} style={progressCard}>
                    <p style={{ marginBottom: "0.5rem" }}>
                      <strong>Data:</strong> {formatDate(p.progressDate)}
                    </p>
                    <p style={{ whiteSpace: "pre-line" }}>
                      <strong>Descrição:</strong> {p.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
    </div>
  );
}

function formatDate(iso) {
  return iso ? new Date(iso).toLocaleDateString("pt-BR") : "";
}

const labelMap = {};
TEMPLATES.forEach((t) => {
  t.fields.forEach((f) => {
    labelMap[f.fieldName] = f.label || f.fieldName;
  });
});

function formatKey(key) {
  return labelMap[key] || key;
}

function btn(color) {
  const colors = {
    gray: "#d3d3d3",
    green: "#00C9A7",
    blue: "#1e90ff",
  };
  return {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.6rem 1.2rem",
    backgroundColor: colors[color],
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    color: color === "gray" ? "#333" : "#fff",
    transition: "background 0.3s ease",
  };
}
