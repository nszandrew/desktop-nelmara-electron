import React, { useState } from "react";
import PatientStep from "./registerSteps/PatientStep";
import TemplateStep from "./registerSteps/TemplateStep";
import ProgressBar from "./registerSteps/ProgressBar";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import ProgressStep from "./registerSteps/ProgressStep";

export default function PatientRegisterPage() {
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState(null);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    patient: {},
    progress: { items: [] },
  });

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

  const handlePatientSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const getDateIso = (val) => {
        if (!val) return new Date().toISOString();
        const d = new Date(val);
        return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
      };

      const payload = {
        patient: {
          fullName: formData.patient.fullName || "",
          cpf: formData.patient.cpf || "",
          email: formData.patient.email || "",
          phone: formData.patient.phone || "",
          dateOfBirth: getDateIso(formData.patient.dateOfBirth),
          address: formData.patient.address || "",
          profession: formData.patient.profession || "",
          indication: formData.patient.indication || "",
          gender: formData.patient.gender || "MALE",
        },
      };

      const res = await api.post("/patient", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatientId(res.data.id);
      setStep(step + 1);
      alert("Paciente registrado com sucesso!");
    } catch (err) {
      console.error("Erro ao registrar paciente:", err);
      alert("Erro ao registrar paciente. Corrija os dados e tente novamente.");
    }
  };

  const handleProgressSubmit = () => {
    // aqui você pode validar se o progresso está ok antes de avançar
    setStep(step + 1);
  };

  const handleTemplateSubmit = async (templateId, answers, treatmentInstanceId) => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        patientId,
        templateId: Number(templateId),
        treatmentDate: new Date().toISOString(),
        progress: formData.progress.items || [],
        data: answers,
      };

      if (treatmentInstanceId) {
        alert("Tratamento atualizado com sucesso!");
      } else {
        alert("Paciente e Tratamento vinculados com sucesso!");
        navigate("/");
      }
    } catch (err) {
      console.error("Erro ao salvar tratamento:", err);
      alert("Erro ao salvar tratamento.");
    }
  };

  return (
    <div style={styles.container}>
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

      <div style={styles.stepWrapper}>
        {step === 0 && (
          <PatientStep
            data={formData.patient}
            onChange={(data) => handleChange("patient", data)}
          />
        )}

        {step === 1 && (
          <ProgressStep
            data={formData.progress}
            onChange={(data) => handleChange("progress", data)}
          />
        )}

        {step === 2 && patientId && (
          <TemplateStep
            onSubmit={handleTemplateSubmit}
            patientId={patientId}
            initialValues={{ progress: formData.progress.items || [] }}
          />
        )}
      </div>

      <div style={styles.buttons}>
        {step > 0 && (
          <button onClick={() => setStep(step - 1)} style={styles.back}>
            ← Voltar
          </button>
        )}
        {step === 0 && (
          <button onClick={handlePatientSubmit} style={styles.next}>
            Avançar →
          </button>
        )}
        {step === 1 && (
          <button onClick={handleProgressSubmit} style={styles.next}>
            Avançar →
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "2rem auto",
    padding: "2rem",
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
    fontFamily: "Segoe UI, sans-serif",
    animation: "fadeIn 0.5s ease-in-out",
  },
  stepWrapper: {
    minHeight: "400px",
    transition: "all 0.3s ease",
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "2rem",
  },
  back: {
    padding: "0.7rem 1.2rem",
    backgroundColor: "#d3d3d3",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  next: {
    padding: "0.7rem 1.2rem",
    backgroundColor: "#00C9A7",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
