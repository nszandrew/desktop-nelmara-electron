// EditPatientPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PatientStep from "./registerSteps/PatientStep";
import EvaluationStep from "./registerSteps/EvaluationStep";
import MedicalHistoryStep from "./registerSteps/MedicalHistoryStep";
import LifestyleStep from "./registerSteps/LifestyleStep";
import ProgressBar from "./registerSteps/ProgressBar";
import api from "../services/api";

export default function EditPatientPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    patient: {},
    evaluation: {},
    medicalHistory: {},
    lifestyle: {},
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
          evaluation: {
            ...res.data.evaluation,
            date: formatDate(res.data.evaluation?.date),
          },
          medicalHistory: res.data.medicalHistory || {},
          lifestyle: res.data.lifestyle || {},
        };

        setFormData(formattedData);
      } catch (err) {
        alert("Erro ao buscar dados do paciente.");
      }
    };
    fetchPatient();
  }, [id]);

  const steps = [
    { component: PatientStep, key: "patient" },
    { component: EvaluationStep, key: "evaluation" },
    { component: MedicalHistoryStep, key: "medicalHistory" },
    { component: LifestyleStep, key: "lifestyle" },
  ];

  const CurrentStep = steps[step].component;

  const handleChange = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        patient: {
          ...formData.patient,
          cpf: formData.patient.cpf
            .replace(/\D/g, "")
            .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"),
          dateOfBirth: new Date(formData.patient.dateOfBirth).toISOString(),
        },
        evaluation: {
          ...formData.evaluation,
          date: new Date(formData.evaluation.date).toISOString().split("T")[0],
          weight: parseFloat(formData.evaluation.weight || 0),
          height: parseFloat(formData.evaluation.height || 0),
          painLevel: parseInt(formData.evaluation.painLevel || 0),
        },
        medicalHistory: {
          ...formData.medicalHistory,
        },
        lifestyle: {
          ...formData.lifestyle,
        },
      };

      await api.put(`/patient/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Paciente atualizado com sucesso!");
      navigate("/");
    } catch (err) {
      console.error("Erro ao atualizar paciente:", err);
      alert("Erro ao atualizar paciente.");
    }
  };

  const validateStep = (data, key) => {
    switch (key) {
      case "patient":
        return (
          data.fullName &&
          data.email &&
          data.phone &&
          data.dateOfBirth &&
          data.gender &&
          data.cpf
        );
      case "evaluation":
        return (
          data.date &&
          data.mainComplaint &&
          data.hmp &&
          data.hma &&
          data.weight &&
          data.height &&
          data.painLevel
        );
      case "medicalHistory":
        return typeof data.allergy === "boolean";
      case "lifestyle":
        return (
          data.physicalActivity !== undefined && data.medications !== undefined
        );
      default:
        return true;
    }
  };

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
      <ProgressBar currentStep={step} totalSteps={steps.length} />
      <div style={{ minHeight: "400px", transition: "all 0.3s ease" }}>
        <CurrentStep
          data={formData[steps[step].key]}
          onChange={(data) => handleChange(steps[step].key, data)}
        />
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
        {step < steps.length - 1 ? (
          <button
            onClick={() => {
              const currentKey = steps[step].key;
              const currentData = formData[currentKey];
              if (!validateStep(currentData, currentKey)) {
                alert("Preencha todos os campos obrigatórios.");
                return;
              }
              setStep(step + 1);
            }}
            style={{
              padding: "0.7rem 1.2rem",
              backgroundColor: "#00C9A7",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Avançar →
          </button>
        ) : (
          <button
            onClick={handleUpdate}
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
            Atualizar Paciente
          </button>
        )}
      </div>
    </div>
  );
}
