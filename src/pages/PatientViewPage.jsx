import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { motion } from "framer-motion";
import { FaUser, FaHeartbeat, FaStethoscope, FaRunning, FaEdit, FaArrowLeft } from "react-icons/fa";

export default function ViewPatientPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

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

  if (!data) return <p style={{ textAlign: "center", color: "#fff" }}>Carregando...</p>;

  const sectionStyle = {
    marginBottom: "2rem",
    padding: "1.5rem",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        minHeight: "100vh",
        padding: "3rem 1rem",
        backgroundColor: "#025C4A",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
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
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem" }}>
          <button onClick={() => navigate("/")} style={btn("gray")}>
            <FaArrowLeft /> Voltar
          </button>
          <button onClick={() => navigate(`/edit/${id}`)} style={btn("green")}>
            <FaEdit /> Editar
          </button>
        </div>

        <section style={sectionStyle}>
          <div style={titleStyle}><FaUser /> Dados Pessoais</div>
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

        <section style={sectionStyle}>
          <div style={titleStyle}><FaStethoscope /> Avaliação Clínica</div>
          <p><strong>Data:</strong> {formatDate(data.evaluation?.date)}</p>
          <p><strong>Queixa Principal:</strong> {data.evaluation?.mainComplaint}</p>
          <p><strong>HMP:</strong> {data.evaluation?.hmp}</p>
          <p><strong>HMA:</strong> {data.evaluation?.hma}</p>
          <p><strong>Peso:</strong> {data.evaluation?.weight} kg</p>
          <p><strong>Altura:</strong> {data.evaluation?.height} m</p>
          <p><strong>Dor (0 a 10):</strong> {data.evaluation?.painLevel}</p>
          <p><strong>Frequência Cardíaca:</strong> {data.evaluation?.heartRate}</p>
          <p><strong>Frequência Respiratória:</strong> {data.evaluation?.respiratoryRate}</p>
        </section>

        <section style={sectionStyle}>
          <div style={titleStyle}><FaHeartbeat /> Histórico Médico</div>
          <p><strong>Condições Associadas:</strong> {data.medicalHistory?.associatedConditions}</p>
          {Object.entries(data.medicalHistory || {}).filter(([k]) => k !== "associatedConditions").map(([k, v]) => (
            <p key={k}><strong>{formatKey(k)}:</strong> {v ? "Sim" : "Não"}</p>
          ))}
        </section>

        <section style={sectionStyle}>
          <div style={titleStyle}><FaRunning /> Estilo de Vida</div>
          <p><strong>Atividade Física:</strong> {data.lifestyle?.physicalActivity}</p>
          <p><strong>Cirurgias:</strong> {data.lifestyle?.pastSurgeries}</p>
          <p><strong>Fraturas:</strong> {data.lifestyle?.fractures}</p>
          <p><strong>Fuma:</strong> {data.lifestyle?.smoking ? "Sim" : "Não"}</p>
          <p><strong>Consome álcool:</strong> {data.lifestyle?.alcohol ? "Sim" : "Não"}</p>
          <p><strong>Medicamentos:</strong> {data.lifestyle?.medications}</p>
        </section>
      </div>
    </motion.div>
  );
}

function formatDate(iso) {
  return iso ? new Date(iso).toLocaleDateString("pt-BR") : "";
}

function formatKey(key) {
  const map = {
    allergy: "Alergia",
    enzymeDeficiencyG6PD: "Def. G6PD",
    sinusitis: "Sinusite",
    rhinitis: "Rinite",
    diabetesMellitus: "Diabetes",
    highBloodPressure: "Hipertensão",
    cardiopathy: "Cardiopatia",
    anemia: "Anemia",
    hyperthyroidism: "Hipertireoidismo",
    recentCovidVaccine: "Vacina COVID recente",
    recentHemorrhage: "Hemorragia recente",
  };
  return map[key] || key;
}

function btn(color) {
  const colors = {
    gray: "#d3d3d3",
    green: "#00C9A7",
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
