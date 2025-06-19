import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Sidebar from "../pages/Sidebar";
import { motion } from "framer-motion";
import { FaClipboardList, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

export default function TreatmentTemplateList() {
  const [templates, setTemplates] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const pageSize = 5;

  useEffect(() => {
    fetchTemplates();
  }, [page]);

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(
        `/templates/getall?page=${page}&size=${pageSize}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const isArray = Array.isArray(res.data);
      if (isArray) {
        setTemplates(res.data); // caso o backend retorne apenas um array
        setTotalPages(1);
      } else {
        setTemplates(res.data.content || []); // fallback seguro
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error("Erro ao buscar templates:", err);
      setTemplates([]); // evita a tela branca mesmo se der erro
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este template?")) {
      const token = localStorage.getItem("token");
      await api.delete(`/template/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTemplates(); // Atualiza lista
    }
  };

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 0));
  const handleNext = () =>
    setPage((prev) => Math.min(prev + 1, totalPages - 1));

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#025C4A",
      }}
    >
      <Sidebar />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          flex: 1,
          padding: "3rem 2rem",
          fontFamily: "Segoe UI, sans-serif",
          marginLeft: "100px", // espaço da sidebar
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            <h2 style={{ color: "#025C4A", margin: 0 }}>
              <FaClipboardList style={{ marginRight: "0.5rem" }} />
              Templates de Tratamento
            </h2>
            <button
              onClick={() => navigate("/treatments/new")}
              style={btn("green")}
            >
              <FaPlus /> Novo Tratamento
            </button>
          </div>

          {templates.length === 0 ? (
            <div
              style={{ textAlign: "center", color: "#999", padding: "2rem" }}
            >
              <p style={{ fontSize: "1.2rem" }}>
                🚫 Nenhum template cadastrado ainda.
              </p>
              <p style={{ fontSize: "1rem" }}>
                Clique em <strong>+ Novo Tratamento</strong> para começar.
              </p>
            </div>
          ) : (
            templates.map((template) => (
              <div
                key={template.id}
                style={{
                  padding: "1.2rem",
                  borderRadius: "10px",
                  backgroundColor: "#F5F5F5",
                  marginBottom: "1rem",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                <h3 style={{ margin: "0 0 0.5rem 0", color: "#037E63" }}>
                  {template.name}
                </h3>
                <p style={{ marginBottom: "1rem" }}>{template.description}</p>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => navigate(`/treatments/edit/${template.id}`)}
                    style={btn("blue")}
                  >
                    <FaEdit /> Editar
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    style={btn("gray")}
                  >
                    <FaTrash /> Excluir
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Paginação */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "2rem",
              gap: "1rem",
            }}
          >
            <button
              onClick={handlePrev}
              disabled={page === 0}
              style={paginationBtn(page === 0)}
            >
              ← Anterior
            </button>
            <span style={{ fontWeight: "bold", color: "#025C4A" }}>
              Página {page + 1} de {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={page + 1 >= totalPages}
              style={paginationBtn(page + 1 >= totalPages)}
            >
              Próxima →
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
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

function paginationBtn(disabled) {
  return {
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    backgroundColor: disabled ? "#ccc" : "#00C9A7",
    color: disabled ? "#666" : "#fff",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: "bold",
    transition: "0.3s",
  };
}
