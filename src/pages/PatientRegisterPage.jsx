import React, { useState } from "react";
import PatientStep from "./registerSteps/PatientStep";
import EvaluationStep from "./registerSteps/EvaluationStep";
import MedicalHistoryStep from "./registerSteps/MedicalHistoryStep";
import LifestyleStep from "./registerSteps/LifestyleStep";
import ProgressBar from "./registerSteps/ProgressBar";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function PatientRegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    patient: {},
    evaluation: {},
    medicalHistory: {},
    lifestyle: {},
  });

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

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        patient: {
          fullName: formData.patient.fullName || "",
          cpf: formatCPF(formData.patient.cpf || ""),
          email: formData.patient.email || "",
          phone: formData.patient.phone || "",
          dateOfBirth: new Date(formData.patient.dateOfBirth).toISOString(),
          address: formData.patient.address || "",
          profession: formData.patient.profession || "",
          indication: formData.patient.indication || "",
          gender: formData.patient.gender || "MALE",
        },
        evaluation: {
          date: formData.evaluation.date || "",
          mainComplaint: formData.evaluation.mainComplaint || "",
          hmp: formData.evaluation.hmp || "",
          hma: formData.evaluation.hma || "",
          weight: parseFloat(formData.evaluation.weight || 0),
          height: parseFloat(formData.evaluation.height || 0),
          painLevel: parseInt(formData.evaluation.painLevel || 0),
          heartRate: formData.evaluation.heartRate || "",
          respiratoryRate: formData.evaluation.respiratoryRate || "",
        },
        medicalHistory: {
          associatedConditions:
            formData.medicalHistory.associatedConditions || "",
          allergy: !!formData.medicalHistory.allergy,
          enzymeDeficiencyG6PD: !!formData.medicalHistory.enzymeDeficiencyG6PD,
          sinusitis: !!formData.medicalHistory.sinusitis,
          rhinitis: !!formData.medicalHistory.rhinitis,
          diabetesMellitus: !!formData.medicalHistory.diabetesMellitus,
          highBloodPressure: !!formData.medicalHistory.highBloodPressure,
          cardiopathy: !!formData.medicalHistory.cardiopathy,
          anemia: !!formData.medicalHistory.anemia,
          hyperthyroidism: !!formData.medicalHistory.hyperthyroidism,
          recentCovidVaccine: !!formData.medicalHistory.recentCovidVaccine,
          recentHemorrhage: !!formData.medicalHistory.recentHemorrhage,
        },
        lifestyle: {
          physicalActivity: formData.lifestyle.physicalActivity || "",
          pastSurgeries: formData.lifestyle.pastSurgeries || "",
          fractures: formData.lifestyle.fractures || "",
          smoking: !!formData.lifestyle.smoking,
          alcohol: !!formData.lifestyle.alcohol,
          medications: formData.lifestyle.medications || "",
        },
      };

      await api.post("/patient", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Paciente registrado com sucesso!");
      navigate("/");
    } catch (err) {
      console.error("Erro ao registrar paciente:", err);
      alert("Erro ao registrar paciente.");
    }
  };

  function formatCPF(cpf) {
    return cpf
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

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
        return typeof data.allergy === "boolean"; // pelo menos validando presença de bool
      case "lifestyle":
        return (
          data.physicalActivity !== undefined && data.medications !== undefined
        );
      default:
        return true;
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
        <CurrentStep
          data={formData[steps[step].key]}
          onChange={(data) => handleChange(steps[step].key, data)}
        />
      </div>
      <div style={styles.buttons}>
        {step > 0 && (
          <button onClick={() => setStep(step - 1)} style={styles.back}>
            ← Voltar
          </button>
        )}
        {step < steps.length - 1 ? (
          <button
            onClick={() => {
              const currentKey = steps[step].key;
              const currentData = formData[currentKey];
              if (!validateStep(currentData, currentKey)) {
                alert(
                  "Por favor, preencha todos os campos obrigatórios antes de continuar."
                );
                return;
              }
              setStep(step + 1);
            }}
            style={styles.next}
          >
            Avançar →
          </button>
        ) : (
          <button onClick={handleSubmit} style={styles.submit}>
            Salvar Paciente
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
  submit: {
    padding: "0.7rem 1.2rem",
    backgroundColor: "#037E63",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
