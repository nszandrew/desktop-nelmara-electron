// src/pages/EditPatientPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PatientStep from "./registerSteps/PatientStep";
import ProgressBar from "./registerSteps/ProgressBar";
import ProgressStep from "./registerSteps/ProgressStep";
import TemplateStep from "./registerSteps/TemplateStep";
import api from "../services/api";
import { TEMPLATES } from "../utils/Templates";

export default function EditPatientPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [patientData, setPatientData] = useState(null);
  const [formData, setFormData] = useState({
    patient: {},
    progress: {}
  });

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/patient/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formatDate = (iso) =>
          iso ? new Date(iso).toISOString().split("T")[0] : "";

        const instance = res.data.treatmentInstance?.[0];

        const formattedData = {
          patient: {
            fullName: res.data.fullName,
            cpf: res.data.cpf,
            email: res.data.email,
            phone: res.data.phone,
            dateOfBirth: formatDate(res.data.dateOfBirth),
            address: res.data.address,
            profession: res.data.profession,
            indication: res.data.indication,
            gender: res.data.gender,
          },
          progress: { items: instance?.progress || [] },
        };

        setFormData(formattedData);
        setPatientData(res.data); // salva todos os dados do paciente
      } catch (err) {
        console.error(err);
        alert("Erro ao buscar dados do paciente.");
      }
    };
    fetchPatient();
  }, [id]);

  const steps = [
    { component: PatientStep, key: "patient" },
    { component: ProgressStep, key: "progress" },
    { component: TemplateStep, key: "template" },
  ];

  const CurrentStep = steps[step].component;

  const handleChange = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  const handleTemplateUpdate = async (treatments) => {
    try {
      alert("Tratamentos atualizados com sucesso!");
      navigate("/");
    } catch (err) {
      console.error("Erro ao atualizar tratamentos:", err);
      alert("Erro ao atualizar tratamentos.");
    }
  };

  if (!patientData) {
    return <div>Carregando...</div>;
  }

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "2rem auto",
        padding: "2rem",
        backgroundColor: "#fff",
        borderRadius: "16px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
        fontFamily: "Segoe UI, sans-serif",
        animation: "fadeIn 0.5s ease-in-out",
      }}
    >
      <button
        onClick={() => navigate("/")}
        style={{
          marginBottom: "1rem",
          padding: "0.6rem 1.2rem",
          backgroundColor: "#d3d3d3",
          border: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        ← Voltar para o Início
      </button>
      <ProgressBar currentStep={step} totalSteps={steps.length} />
      <div style={{ minHeight: "400px", transition: "all 0.3s ease" }}>
        {steps[step].key === "template" ? (
          <TemplateStep
            patientId={id}
            initialValues={{}}
            existingTreatments={patientData.treatmentInstance || []}
            onSubmit={handleTemplateUpdate}
          />
        ) : (
          <CurrentStep
            data={formData[steps[step].key]}
            onChange={(data) => handleChange(steps[step].key, data)}
          />
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "2rem",
        }}
      >
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            style={{
              padding: "0.7rem 1.2rem",
              backgroundColor: "#d3d3d3",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ← Voltar
          </button>
        )}

        {step === 0 && (
          <button
            onClick={async () => {
              try {
                const token = localStorage.getItem("token");
                const payload = {
                  fullName: formData.patient.fullName,
                  cpf: formData.patient.cpf,
                  email: formData.patient.email,
                  phone: formData.patient.phone,
                  dateOfBirth: new Date(formData.patient.dateOfBirth).toISOString(),
                  address: formData.patient.address,
                  profession: formData.patient.profession,
                  indication: formData.patient.indication,
                  gender: formData.patient.gender,
                };
                await api.put(`/patient/${id}`, payload, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                setStep(step + 1);
              } catch (err) {
                console.error("Erro ao atualizar paciente:", err);
                alert("Erro ao atualizar paciente.");
              }
            }}
            style={{
              padding: "0.7rem 1.2rem",
              backgroundColor: "#037E63",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Atualizar Paciente e Avançar →
          </button>
        )}

        {step === 1 && (
          <button
            onClick={() => setStep(step + 1)}
            style={{
              padding: "0.7rem 1.2rem",
              backgroundColor: "#037E63",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Avançar para Tratamento →
          </button>
        )}
      </div>
    </div>
  );
}