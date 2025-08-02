import React, { useState, useRef, useEffect } from "react";
import { FaArrowLeft, FaDownload, FaUpload, FaTrash, FaEye, FaEyeSlash, FaFilePdf } from "react-icons/fa";
import Sidebar from "./Sidebar";

import cervicalImg from "public/assets/cervical.png";
import dorsalImg from "public/assets/dorsal.png";
import lombarImg from "public/assets/lombar.png";
import membrosSuperioresImg from "public/assets/membros-superiores.png";
import punhoCotoveloImg from "public/assets/punho-cotovelo.png";
import tornozeloPeImg from "public/assets/tornozelo-pe.png";
import joelhoImg from "public/assets/joelho.png";
import quadrilImg from "public/assets/quadril.png";
import muscularImg from "public/assets/muscular.png";
import colicaMenstrualImg from "public/assets/colica-menstrual.png";
import ATMImg from "public/assets/atm.png";
import colunaImg from "public/assets/coluna.png";
import anatomicoImg from "public/assets/modelo.png";

export default function RmaInteractivePage() {
  const rmaPages = [
    { id: 1, title: "CERVICAL", imageSrc: cervicalImg },
    { id: 2, title: "DORSAL", imageSrc: dorsalImg },
    { id: 3, title: "LOMBAR", imageSrc: lombarImg },
    { id: 4, title: "MEMBROS SUPERIORES (MMSS)", imageSrc: membrosSuperioresImg },
    { id: 5, title: "PUNHO / COTOVELO", imageSrc: punhoCotoveloImg },
    { id: 6, title: "TORNOZELO E PÉ", imageSrc: tornozeloPeImg },
    { id: 7, title: "JOELHO", imageSrc: joelhoImg },
    { id: 8, title: "QUADRIL", imageSrc: quadrilImg },
    { id: 9, title: "MUSCULAR", imageSrc: muscularImg },
    { id: 10, title: "CÓLICA MENSTRUAL", imageSrc: colicaMenstrualImg },
    { id: 11, title: "ATM", imageSrc: ATMImg },
    { id: 12, title: "COLUNA", imageSrc: colunaImg },
    { id: 13, title: "MODELOS ANATÔMICOS", imageSrc: anatomicoImg }
  ];

  // Estados
  const [currentPageId, setCurrentPageId] = useState(1);
  const [savedPoints, setSavedPoints] = useState({});
  const [showPoints, setShowPoints] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const fileInputRef = useRef(null);

  // Simulate backend API calls (replace with real API)
  const savePointsToBackend = async (points) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // const response = await fetch('/api/rma/points', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ points })
      // });
      showNotification("Pontos salvos com sucesso! ✅", "success");
    } catch (error) {
      showNotification("Erro ao salvar pontos ❌", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const loadPointsFromBackend = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // const response = await fetch('/api/rma/points');
      // const data = await response.json();
      // setSavedPoints(data.points || {});
      showNotification("Pontos carregados! 📥", "success");
    } catch (error) {
      showNotification("Erro ao carregar pontos ❌", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Funções de gerenciamento de pontos
  const addPoint = (pageId, point) => {
    const newPoint = {
      ...point,
      id: Date.now() + Math.random(),
      timestamp: Date.now()
    };
    
    setSavedPoints(prev => ({
      ...prev,
      [pageId]: [...(prev[pageId] || []), newPoint]
    }));

    showNotification("Ponto adicionado! 📍", "success");
  };

  const removePoint = (pageId, pointId) => {
    setSavedPoints(prev => ({
      ...prev,
      [pageId]: prev[pageId]?.filter(p => p.id !== pointId) || []
    }));
    showNotification("Ponto removido! 🗑️", "info");
  };

  const clearPagePoints = (pageId) => {
    setSavedPoints(prev => ({
      ...prev,
      [pageId]: []
    }));
    showNotification("Todos os pontos da página foram removidos! 🧹", "info");
  };

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(""), 3000);
  };

  // Export/Import functions
  const exportPoints = () => {
    const dataStr = JSON.stringify(savedPoints, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rma-pontos-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification("Arquivo exportado! 💾", "success");
  };

  const importPoints = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          setSavedPoints(importedData);
          showNotification("Pontos importados com sucesso! 📂", "success");
        } catch (error) {
          showNotification("Erro ao importar arquivo! ❌", "error");
        }
      };
      reader.readAsText(file);
    }
  };

  // Componente da imagem interativa
  const InteractiveImage = ({ page }) => {
    const imageRef = useRef(null);
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleImageClick = (e) => {
      if (!imageRef.current) return;
      
      const rect = imageRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      addPoint(page.id, { x, y });
    };

    const currentPoints = savedPoints[page.id] || [];

    return (
      <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
        <img
          ref={imageRef}
          src={page.imageSrc}
          alt={page.title}
          style={{
            width: '100%',
            maxWidth: '800px',
            height: 'auto',
            cursor: 'crosshair',
            borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            opacity: imageLoaded ? 1 : 0.5,
            transition: 'opacity 0.3s ease'
          }}
          onClick={handleImageClick}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            showNotification(`Erro ao carregar imagem: ${page.title} ❌`, "error");
          }}
        />
        
        {!imageLoaded && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#666',
            fontSize: '1.2rem'
          }}>
            Carregando imagem...
          </div>
        )}

        {/* Renderizar pontos salvos */}
        {showPoints && currentPoints.map(point => (
          <div
            key={point.id}
            style={{
              position: 'absolute',
              left: `${point.x}%`,
              top: `${point.y}%`,
              width: '16px',
              height: '16px',
              backgroundColor: '#037E63',
              borderRadius: '50%',
              border: '3px solid white',
              cursor: 'pointer',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
              animation: 'pulse 2s infinite',
              transition: 'all 0.2s ease'
            }}
            onClick={(e) => {
              e.stopPropagation();
              removePoint(page.id, point.id);
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translate(-50%, -50%) scale(1.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translate(-50%, -50%) scale(1)';
            }}
            title={`Clique para remover\nCriado em: ${new Date(point.timestamp).toLocaleString()}`}
          />
        ))}

        {/* CSS para animação */}
        <style jsx>{`
          @keyframes pulse {
            0% { box-shadow: 0 2px 8px rgba(0,0,0,0.4), 0 0 0 0 rgba(3, 126, 99, 0.7); }
            70% { box-shadow: 0 2px 8px rgba(0,0,0,0.4), 0 0 0 10px rgba(3, 126, 99, 0); }
            100% { box-shadow: 0 2px 8px rgba(0,0,0,0.4), 0 0 0 0 rgba(3, 126, 99, 0); }
          }
        `}</style>
      </div>
    );
  };

  // Painel de controle dos pontos
  const PointsPanel = ({ pageId }) => {
    const currentPoints = savedPoints[pageId] || [];
    
    return (
      <div style={{
        marginTop: '1.5rem',
        padding: '1.5rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        border: '1px solid #e9ecef'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h4 style={{ margin: 0, color: '#025C4A' }}>
            📍 Pontos Marcados ({currentPoints.length})
          </h4>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setShowPoints(!showPoints)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: showPoints ? '#037E63' : '#333333',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {showPoints ? <FaEye /> : <FaEyeSlash />}
              {showPoints ? 'Ocultar' : 'Mostrar'}
            </button>
            {currentPoints.length > 0 && (
              <button
                onClick={() => clearPagePoints(pageId)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#029B7B',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <FaTrash /> Limpar Todos
              </button>
            )}
          </div>
        </div>

        {currentPoints.length === 0 ? (
          <p style={{ color: '#333333', fontStyle: 'italic', margin: 0 }}>
            Nenhum ponto marcado. Clique na imagem para adicionar pontos.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
            {currentPoints.map((point, index) => (
              <div
                key={point.id}
                style={{
                  padding: '0.75rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid #00C9A7',
                  fontSize: '0.85rem'
                }}
              >
                <div style={{ fontWeight: 'bold', color: '#025C4A' }}>
                  Ponto {index + 1}
                </div>
                <div style={{ color: '#333333' }}>
                  X: {point.x.toFixed(1)}% | Y: {point.y.toFixed(1)}%
                </div>
                <div style={{ color: '#333333', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  {new Date(point.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const currentPage = rmaPages.find(p => p.id === currentPageId);
  const totalPoints = Object.values(savedPoints).reduce((sum, points) => sum + points.length, 0);

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "#F5F5F5",
      fontFamily: "Segoe UI, sans-serif",
    }}>
      <Sidebar />
      
      <div style={{
        marginLeft: "70px",
        padding: "2rem",
        width: "100%",
        animation: "fadeIn 0.5s ease-in",
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          padding: "2rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            paddingBottom: '1rem',
            borderBottom: '2px solid #00C9A7'
          }}>
            <div>
              <h1 style={{ 
                margin: 0, 
                color: '#025C4A', 
                fontSize: '1.8rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FaFilePdf /> RMA Interactive - Sistema de Marcação
              </h1>
              <p style={{ margin: '0.5rem 0 0 0', color: '#333333' }}>
                Sistema de marcação de pontos • Total: {totalPoints} pontos
              </p>
            </div>
            
            {/* Controles principais */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => window.history.back()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.7rem 1.3rem',
                  backgroundColor: '#333333',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                  transition: 'background 0.3s ease',
                }}
              >
                <FaArrowLeft /> Voltar
              </button>
              
              <button
                onClick={exportPoints}
                disabled={totalPoints === 0}
                style={{
                  padding: '0.75rem 1.25rem',
                  backgroundColor: totalPoints === 0 ? '#333333' : '#00C9A7',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: totalPoints === 0 ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: '500',
                  opacity: totalPoints === 0 ? 0.6 : 1
                }}
              >
                <FaDownload /> Exportar
              </button>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: '0.75rem 1.25rem',
                  backgroundColor: '#029B7B',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: '500'
                }}
              >
                <FaUpload /> Importar
              </button>
              
              <button
                onClick={() => savePointsToBackend(savedPoints)}
                disabled={isLoading}
                style={{
                  padding: '0.75rem 1.25rem',
                  backgroundColor: isLoading ? '#333333' : '#037E63',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  opacity: isLoading ? 0.6 : 1
                }}
              >
                {isLoading ? '⏳ Salvando...' : '💾 Salvar no Servidor'}
              </button>
            </div>
          </div>

          {/* Notification */}
          {notification && (
            <div style={{
              padding: '1rem',
              marginBottom: '1rem',
              backgroundColor: notification.type === 'error' ? '#029B7B' : 
                             notification.type === 'success' ? '#00C9A7' : '#037E63',
              color: '#FFFFFF',
              borderRadius: '8px',
              border: `1px solid ${notification.type === 'error' ? '#025C4A' : 
                                  notification.type === 'success' ? '#037E63' : '#029B7B'}`,
              fontWeight: '500'
            }}>
              {notification.message}
            </div>
          )}

          {/* Seletor de páginas */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {rmaPages.map(page => {
              const pointCount = savedPoints[page.id]?.length || 0;
              const isActive = page.id === currentPageId;
              
              return (
                <button
                  key={page.id}
                  onClick={() => setCurrentPageId(page.id)}
                  style={{
                    padding: '1rem',
                    backgroundColor: isActive ? '#037E63' : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : '#025C4A',
                    border: isActive ? 'none' : '1px solid #00C9A7',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    textAlign: 'left',
                    transition: 'all 0.3s ease',
                    boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                    transform: isActive ? 'translateY(-2px)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = '#F5F5F5';
                      e.target.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = '#FFFFFF';
                      e.target.style.transform = 'none';
                    }
                  }}
                >
                  <FaFilePdf style={{ marginRight: '0.5rem' }} />
                  {page.title}
                  {pointCount > 0 && (
                    <div style={{
                      marginTop: '0.5rem',
                      fontSize: '0.8rem',
                      opacity: 0.8
                    }}>
                      📍 {pointCount} ponto{pointCount !== 1 ? 's' : ''}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Visualização da imagem atual */}
          <div style={{
            backgroundColor: '#F5F5F5',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ 
              display: 'flex',
              alignItems: 'center',
              fontSize: '1.4rem',
              fontWeight: '600',
              color: '#025C4A',
              marginBottom: '1rem',
              gap: '0.6rem'
            }}>
              <FaFilePdf /> {currentPage?.title}
            </h2>
            <p style={{ 
              color: '#333333', 
              marginBottom: '1.5rem',
              fontSize: '1rem'
            }}>
              Clique na imagem para marcar pontos • Clique nos pontos para removê-los
            </p>
            
            <InteractiveImage page={currentPage} />
            <PointsPanel pageId={currentPageId} />
          </div>

          {/* Input oculto para importar arquivo */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={importPoints}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </div>
  );
}