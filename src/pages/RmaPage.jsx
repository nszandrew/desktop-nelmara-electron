import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaFilePdf, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Sidebar from "./Sidebar";

export default function RmaPage() {
  const { page } = useParams();
  const navigate = useNavigate();
  const [isPrinting, setIsPrinting] = useState(false);

  const rmaPages = [
    { id: 1, title: "RMA - Dados Gerais" },
    { id: 2, title: "RMA - Especificações Técnicas" },
    { id: 3, title: "RMA - Relatório de Manutenção" },
    { id: 4, title: "RMA - Conclusão" },
  ];

  const pdfBasePath = "./assets/rma-1.pdf";

  useEffect(() => {
    if (isPrinting) {
      const timeout = setTimeout(() => {
        window.print();
        setIsPrinting(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isPrinting]);

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
        button, nav, .no-print, .sidebar {
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

  const styles = {
    wrapper: {
      display: "flex",
      minHeight: "100vh",
      background: "#F5F5F5",
      fontFamily: "Segoe UI, sans-serif",
    },
    content: {
      marginLeft: "70px",
      padding: "2rem",
      width: "100%",
      animation: "fadeIn 0.5s ease-in",
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      background: "#fff",
      borderRadius: "16px",
      padding: "2rem",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1.5rem",
      borderBottom: "2px solid #00C9A7",
      paddingBottom: "1rem",
    },
    headerTitle: {
      fontSize: "1.8rem",
      color: "#025C4A",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    buttonArea: {
      display: "flex",
      gap: "0.5rem",
    },
    pageList: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "1rem",
      marginBottom: "2rem",
    },
    pageButton: (isActive) => ({
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0.8rem 1.2rem",
      backgroundColor: isActive ? "#00C9A7" : "#f0f0f0",
      color: isActive ? "#fff" : "#333",
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "500",
      fontSize: "1rem",
      transition: "all 0.3s ease",
      textAlign: "left",
      boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
      "&:hover": {
        backgroundColor: isActive ? "#029B7B" : "#e0e0e0",
        transform: "translateY(-2px)",
      },
    }),
    pdfSection: {
      backgroundColor: "#fff",
      borderRadius: "12px",
      padding: "1.5rem",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    },
    pdfTitle: {
      display: "flex",
      alignItems: "center",
      fontSize: "1.4rem",
      fontWeight: "600",
      color: "#025C4A",
      marginBottom: "1rem",
      gap: "0.6rem",
    },
    pdfNavigation: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "1rem",
    },
    navButton: {
      padding: "0.5rem 1rem",
      backgroundColor: "#00C9A7",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "0.95rem",
      transition: "background 0.3s ease",
      "&:hover": {
        backgroundColor: "#029B7B",
      },
      "&:disabled": {
        backgroundColor: "#d3d3d3",
        cursor: "not-allowed",
      },
    },
    btn: (color) => ({
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0.7rem 1.3rem",
      backgroundColor:
        color === "gray" ? "#d3d3d3" : color === "green" ? "#00C9A7" : "#1e90ff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      color: color === "gray" ? "#333" : "#fff",
      transition: "background 0.3s ease",
      "&:hover": {
        backgroundColor:
          color === "gray" ? "#c0c0c0" : color === "green" ? "#029B7B" : "#1c82e6",
      },
    }),
  };

  const currentPage = parseInt(page) || 1;
  const maxPage = rmaPages.length;

  const handlePrevPage = () => {
    if (currentPage > 1) {
      navigate(`/rma/${currentPage - 1}`);
    }
  };

  const handleNextPage = () => {
    if (currentPage < maxPage) {
      navigate(`/rma/${currentPage + 1}`);
    }
  };

  return (
    <div style={styles.wrapper}>
      <Sidebar />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={styles.content}
      >
        <div style={styles.container}>
          <div className="no-print" style={styles.header}>
            <div style={styles.headerTitle}>
              <FaFilePdf /> RMA - Relatório de Manutenção
            </div>
            <div style={styles.buttonArea}>
              <button onClick={() => navigate("/")} style={styles.btn("gray")}>
                <FaArrowLeft /> Voltar
              </button>
              <button onClick={() => setIsPrinting(true)} style={styles.btn("blue")}>
                🖨️ Imprimir
              </button>
            </div>
          </div>

          {/* Lista de páginas */}
          <div className="no-print" style={styles.pageList}>
            {rmaPages.map((rma) => (
              <button
                key={rma.id}
                onClick={() => navigate(`/rma/${rma.id}`)}
                style={styles.pageButton(rma.id === currentPage)}
              >
                <FaFilePdf /> {rma.title}
              </button>
            ))}
          </div>

          {/* Visualização do PDF */}
          {page && (
            <section style={styles.pdfSection}>
              <div style={styles.pdfTitle}>
                <FaFilePdf /> {rmaPages.find((p) => p.id === currentPage)?.title || "RMA"}
              </div>
              <object
                data={`${pdfBasePath}#page=${currentPage}`}
                type="application/pdf"
                width="100%"
                height="800px"
                style={{ borderRadius: "8px", border: "1px solid #e0e0e0" }}
              >
                <p>
                  Não foi possível carregar o PDF.{" "}
                  <a href={pdfBasePath} target="_blank" rel="noopener noreferrer">
                    Clique aqui para abrir.
                  </a>
                </p>
              </object>
              <div className="no-print" style={styles.pdfNavigation}>
                <button
                  onClick={handlePrevPage}
                  style={styles.navButton}
                  disabled={currentPage === 1}
                >
                  <FaChevronLeft /> Anterior
                </button>
                <span>Página {currentPage} de {maxPage}</span>
                <button
                  onClick={handleNextPage}
                  style={styles.navButton}
                  disabled={currentPage === maxPage}
                >
                  Próxima <FaChevronRight />
                </button>
              </div>
            </section>
          )}
        </div>
      </motion.div>
    </div>
  );
}