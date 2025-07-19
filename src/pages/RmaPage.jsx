import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaFilePdf, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Sidebar from "./Sidebar";

export default function RmaPage() {
  const { page } = useParams();
  const navigate = useNavigate();
  const [isPrinting, setIsPrinting] = useState(false);
  const [pdfKey, setPdfKey] = useState(0);
  const [pdfError, setPdfError] = useState(false);
  const iframeRef = useRef(null);

  const rmaPages = [
    { id: 1, page: 25, title: "BALANCEAMENTO CERVICAL" },
    { id: 2, page: 26, title: "BALANCEAMENTO DE TRAPÉZIOS – FIBRAS SUPERIORES" },
    { id: 3, page: 27, title: "BALANCEAMENTO DORSAL" },
    { id: 4, page: 28, title: "BALANCEAMENTO DAS ARTICULAÇÕES METATARSOFALANGEANAS" },
    { id: 5, page: 29, title: "EDEMA DE JOELHO" },
    { id: 6, page: 30, title: "BALANCEAMENTO DE JOELHOS" },
    { id: 7, page: 31, title: "JOELHO" },
    { id: 8, page: 32, title: "BALANCEAMENTO LÁTERO-LATERAL DE MEMBROS INFERIORES" },
    { id: 9, page: 33, title: "LOMBAR (PÁGINAS 33–35)" },
    { id: 10, page: 36, title: "DISTENSÃO MUSCULAR / CÃIBRAS OU CONTRATURAS" },
    { id: 11, page: 37, title: "BALANCEAMENTO DA MUSCULATURA POSTURAL DE MEMBROS INFERIORES" },
    { id: 12, page: 38, title: "CÓLICA MENSTRUAL" },
    { id: 13, page: 39, title: "BALANCEAMENTO DE ILIOPSOAS" },
    { id: 14, page: 40, title: "CIATALGIA DEVIDO À TENSÃO DO PIRIFORME" },
    { id: 15, page: 41, title: "ENTORSE DE TORNOZELO / PODOPOSTUROLOGIA" },
    { id: 16, page: 42, title: "BALANCEAMENTO DE PUNHOS" },
    { id: 17, page: 43, title: "BALANCEAMENTO DE COTOVELOS" },
    { id: 18, page: 44, title: "BALANCEAMENTO DE MEMBROS SUPERIORES" },
    { id: 19, page: 45, title: "BALANCEAMENTO DE ATM" },
    { id: 20, page: 46, title: "SÍNDROME DO TÚNEL DO CARPO" },
    { id: 21, page: 47, title: "COLUNA VERTEBRAL / TENSÃO EM PARAVERTEBRAIS" },
    { id: 22, page: 49, title: "MODELOS ANATÔMICOS" },
  ];

  // Função para obter o caminho correto do PDF no Electron
  const getPdfPath = () => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (isDevelopment) {
      return './src/assets/rma-1.pdf';
    }
    
    // Em produção no Electron, os assets ficam na pasta resources
    if (window.require) {
      const path = window.require('path');
      const { app } = window.require('@electron/remote') || window.require('electron').remote;
      return path.join(app.getAppPath(), 'assets', 'rma-1.pdf');
    }
    
    // Fallback para diferentes estruturas de pasta
    const possiblePaths = [
      './assets/rma-1.pdf',
      './resources/assets/rma-1.pdf',
      './dist/assets/rma-1.pdf',
      './build/assets/rma-1.pdf'
    ];
    
    return possiblePaths[0]; // Retorna o primeiro como padrão
  };

  const pdfBasePath = getPdfPath();

  // Função para verificar se o PDF existe
  const checkPdfExists = async () => {
    try {
      const response = await fetch(pdfBasePath);
      if (response.ok) {
        setPdfError(false);
        return true;
      } else {
        setPdfError(true);
        return false;
      }
    } catch (error) {
      console.error('Erro ao verificar PDF:', error);
      setPdfError(true);
      return false;
    }
  };

  // Força reload do iframe quando a página muda
  useEffect(() => {
    const loadPdf = async () => {
      setPdfKey(prev => prev + 1);
      
      // Verifica se o PDF existe antes de tentar carregar
      const exists = await checkPdfExists();
      
      if (exists && iframeRef.current) {
        // Adiciona timestamp para forçar reload
        const timestamp = new Date().getTime();
        const pdfUrl = `${pdfBasePath}?t=${timestamp}#page=${currentPage}`;
        
        setTimeout(() => {
          if (iframeRef.current) {
            iframeRef.current.src = pdfUrl;
          }
        }, 200);
      }
    };

    loadPdf();
  }, [page, pdfBasePath]);

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
      fontSize: "0.95rem",
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
    navButton: (disabled) => ({
      padding: "0.5rem 1rem",
      backgroundColor: disabled ? "#d3d3d3" : "#00C9A7",
      color: disabled ? "#666" : "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: disabled ? "not-allowed" : "pointer",
      fontWeight: "bold",
      fontSize: "0.95rem",
      transition: "background 0.3s ease",
      opacity: disabled ? 0.6 : 1,
    }),
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
    }),
    errorMessage: {
      padding: "1rem",
      backgroundColor: "#ffe6e6",
      borderRadius: "8px",
      color: "#d33",
      textAlign: "center",
      marginTop: "1rem",
    },
    successMessage: {
      padding: "1rem",
      backgroundColor: "#e6ffe6",
      borderRadius: "8px",
      color: "#2d5016",
      textAlign: "center",
      marginTop: "1rem",
    },
    debugInfo: {
      padding: "1rem",
      backgroundColor: "#f0f0f0",
      borderRadius: "8px",
      marginTop: "1rem",
      fontSize: "0.85rem",
      color: "#666",
    }
  };

  const currentPage = parseInt(page) || rmaPages[0].page;
  const currentIndex = rmaPages.findIndex((p) => p.page === currentPage) || 0;
  const maxPage = rmaPages.length;

  const handlePrevPage = () => {
    if (currentIndex > 0) {
      navigate(`/rma/${rmaPages[currentIndex - 1].page}`);
    }
  };

  const handleNextPage = () => {
    if (currentIndex < maxPage - 1) {
      navigate(`/rma/${rmaPages[currentIndex + 1].page}`);
    }
  };

  const handleOpenExternal = () => {
    if (window.require) {
      const { shell } = window.require('electron');
      shell.openPath(pdfBasePath);
    } else {
      window.open(pdfBasePath, '_blank');
    }
  };

  const handleReloadPdf = () => {
    setPdfKey(prev => prev + 1);
    if (iframeRef.current) {
      const timestamp = new Date().getTime();
      iframeRef.current.src = `${pdfBasePath}?t=${timestamp}#page=${currentPage}`;
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
              <button onClick={handleReloadPdf} style={styles.btn("green")}>
                🔄 Recarregar PDF
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
                onClick={() => navigate(`/rma/${rma.page}`)}
                style={styles.pageButton(rma.page === currentPage)}
              >
                <FaFilePdf /> {rma.title}
              </button>
            ))}
          </div>

          {/* Visualização do PDF */}
          <section style={styles.pdfSection}>
            <div style={styles.pdfTitle}>
              <FaFilePdf /> {rmaPages.find((p) => p.page === currentPage)?.title || "RMA"}
            </div>
            
            {!pdfError ? (
              <iframe
                key={pdfKey}
                ref={iframeRef}
                src={`${pdfBasePath}#page=${currentPage}`}
                title="RMA PDF"
                width="100%"
                height="800px"
                style={{ 
                  borderRadius: "8px", 
                  border: "1px solid #e0e0e0",
                  backgroundColor: "#f9f9f9"
                }}
                onLoad={() => {
                  console.log(`PDF carregado: página ${currentPage}`);
                }}
                onError={() => {
                  console.error('Erro ao carregar PDF');
                  setPdfError(true);
                }}
              />
            ) : (
              <div style={{ 
                height: "800px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                backgroundColor: "#f9f9f9",
                border: "1px solid #e0e0e0",
                borderRadius: "8px"
              }}>
                <div style={{ textAlign: "center" }}>
                  <FaFilePdf size={64} color="#ccc" />
                  <p>PDF não pôde ser carregado</p>
                  <button onClick={handleReloadPdf} style={styles.btn("green")}>
                    🔄 Tentar novamente
                  </button>
                </div>
              </div>
            )}

            <div className="no-print" style={styles.pdfNavigation}>
              <button
                onClick={handlePrevPage}
                style={styles.navButton(currentIndex === 0)}
                disabled={currentIndex === 0}
              >
                <FaChevronLeft /> Anterior
              </button>
              <span>Página {currentPage} de {rmaPages[rmaPages.length - 1].page}</span>
              <button
                onClick={handleNextPage}
                style={styles.navButton(currentIndex === maxPage - 1)}
                disabled={currentIndex === maxPage - 1}
              >
                Próxima <FaChevronRight />
              </button>
            </div>

            {/* Informações de debug e controles */}
            <div className="no-print">
              {pdfError ? (
                <div style={styles.errorMessage}>
                  ❌ PDF não encontrado no caminho: <code>{pdfBasePath}</code>
                  <br />
                  <button 
                    onClick={handleOpenExternal}
                    style={{ ...styles.btn("blue"), marginTop: "0.5rem" }}
                  >
                    📂 Abrir externamente
                  </button>
                </div>
              ) : (
                <div style={styles.successMessage}>
                  ✅ PDF carregado com sucesso
                </div>
              )}

              <div style={styles.debugInfo}>
                <strong>Informações de debug:</strong><br />
                Caminho do PDF: <code>{pdfBasePath}</code><br />
                Página atual: {currentPage}<br />
                Modo: {process.env.NODE_ENV || 'production'}<br />
                Electron: {window.require ? 'Sim' : 'Não'}
              </div>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}