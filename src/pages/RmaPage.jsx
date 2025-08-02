import React, { useState, useRef, useEffect } from "react";
import { FaArrowLeft, FaTrash, FaEye, FaEyeSlash, FaFilePdf } from "react-icons/fa";
import Sidebar from "./Sidebar";
import api from "../services/api";

import cervicalImg from "/assets/cervical.png";
import dorsalImg from "/assets/dorsal.png";
import lombarImg from "/assets/lombar.png";
import membrosSuperioresImg from "/assets/membros-superiores.png";
import punhoCotoveloImg from "/assets/punho-cotovelo.png";
import tornozeloPeImg from "/assets/tornozelo-pe.png";
import joelhoImg from "/assets/joelho.png";
import quadrilImg from "/assets/quadril.png";
import muscularImg from "/assets/muscular.png";
import colicaMenstrualImg from "/assets/colica-menstrual.png";
import ATMImg from "/assets/atm.png";
import colunaImg from "/assets/coluna.png";
import anatomicoImg from "/assets/modelo.png";

export default function RmaInteractivePage() {
  const rmaPages = [
    { id: 1, title: "CERVICAL", imageSrc: cervicalImg, imgName: "cervical" },
    { id: 2, title: "DORSAL", imageSrc: dorsalImg, imgName: "dorsal" },
    { id: 3, title: "LOMBAR", imageSrc: lombarImg, imgName: "lombar" },
    { id: 4, title: "MEMBROS SUPERIORES (MMSS)", imageSrc: membrosSuperioresImg, imgName: "membros-superiores" },
    { id: 5, title: "PUNHO / COTOVELO", imageSrc: punhoCotoveloImg, imgName: "punho-cotovelo" },
    { id: 6, title: "TORNOZELO E PÉ", imageSrc: tornozeloPeImg, imgName: "tornozelo-pe" },
    { id: 7, title: "JOELHO", imageSrc: joelhoImg, imgName: "joelho" },
    { id: 8, title: "QUADRIL", imageSrc: quadrilImg, imgName: "quadril" },
    { id: 9, title: "MUSCULAR", imageSrc: muscularImg, imgName: "muscular" },
    { id: 10, title: "CÓLICA MENSTRUAL", imageSrc: colicaMenstrualImg, imgName: "colica-menstrual" },
    { id: 11, title: "ATM", imageSrc: ATMImg, imgName: "atm" },
    { id: 12, title: "COLUNA", imageSrc: colunaImg, imgName: "coluna" },
    { id: 13, title: "MODELOS ANATÔMICOS", imageSrc: anatomicoImg, imgName: "modelo-anatomico" }
  ];

  // Estados
  const [currentPageId, setCurrentPageId] = useState(1);
  const [savedPoints, setSavedPoints] = useState({});
  const [showPoints, setShowPoints] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState("");

  // Carregar pontos do backend ao montar o componente
  useEffect(() => {
    loadPointsFromBackend();
  }, []);

  // Funções de API para comunicação com o backend
  const savePointToBackend = async (pageId, point) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const currentPage = rmaPages.find(p => p.id === pageId);
      
      await api.post('/rma/points', 
        { 
          x: point.x,
          y: point.y,
          timestamp: point.timestamp,
          imgName: currentPage.imgName
        }, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      showNotification("Ponto salvo com sucesso! ✅", "success");
    } catch (error) {
      console.error('Erro ao salvar ponto:', error);
      showNotification("Erro ao salvar ponto ❌", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const loadPointsFromBackend = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await api.get('/rma/points', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.information) {
        // Converter a estrutura do backend para a estrutura do frontend
        const convertedPoints = {};
        
        response.data.information.forEach(imageGroup => {
          // Encontrar o ID da página pelo imgName
          const page = rmaPages.find(p => p.imgName === imageGroup.imageName);
          if (page) {
            convertedPoints[page.id] = imageGroup.rmaPoints.map(point => ({
              id: point.id,
              x: point.x,
              y: point.y,
              timestamp: point.timestamp
            }));
          }
        });
        
        setSavedPoints(convertedPoints);
        showNotification("Pontos carregados! 📥", "success");
      } else {
        setSavedPoints({});
        showNotification("Nenhum ponto encontrado", "info");
      }
    } catch (error) {
      console.error('Erro ao carregar pontos:', error);
      showNotification("Erro ao carregar pontos ❌", "error");
      setSavedPoints({});
    } finally {
      setIsLoading(false);
    }
  };

  // Funções de gerenciamento de pontos
  const addPoint = async (pageId, point) => {
    const newPoint = {
      ...point,
      id: Date.now() + Math.random(), // ID temporário para o frontend
      timestamp: Date.now()
    };
    
    // Atualizar estado local primeiro
    const updatedPoints = {
      ...savedPoints,
      [pageId]: [...(savedPoints[pageId] || []), newPoint]
    };
    setSavedPoints(updatedPoints);
    showNotification("Ponto adicionado! 📍", "success");
    
    // Salvar no backend
    await savePointToBackend(pageId, newPoint);
    
    // Recarregar do backend para pegar o ID real
    await loadPointsFromBackend();
  };

  const removePoint = async (pageId, pointId) => {
    try {
      const token = localStorage.getItem("token");
      
      // Remover do backend primeiro
      await api.delete(`/rma/points/${pointId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Atualizar estado local
      const updatedPoints = {
        ...savedPoints,
        [pageId]: savedPoints[pageId]?.filter(p => p.id !== pointId) || []
      };
      setSavedPoints(updatedPoints);
      showNotification("Ponto removido! 🗑️", "info");
      
    } catch (error) {
      console.error('Erro ao remover ponto:', error);
      showNotification("Erro ao remover ponto ❌", "error");
    }
  };

  const clearPagePoints = async (pageId) => {
    try {
      const token = localStorage.getItem("token");
      const currentPage = rmaPages.find(p => p.id === pageId);
      const currentPoints = savedPoints[pageId] || [];
      
      // Remover todos os pontos da página no backend
      for (const point of currentPoints) {
        await api.delete(`/rma/points/${point.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      // Atualizar estado local
      const updatedPoints = {
        ...savedPoints,
        [pageId]: []
      };
      setSavedPoints(updatedPoints);
      showNotification("Todos os pontos da página foram removidos! 🧹", "info");
      
    } catch (error) {
      console.error('Erro ao limpar pontos:', error);
      showNotification("Erro ao limpar pontos ❌", "error");
    }
  };

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(""), 3000);
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
      <div style={{ position: 'relative', display: 'inline-block', width: '800px', height: '600px' }}>
        <img
          ref={imageRef}
          src={page.imageSrc}
          alt={page.title}
          style={{
            width: '800px',
            height: '600px',
            objectFit: 'contain',
            cursor: 'crosshair',
            borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            opacity: imageLoaded ? 1 : 0.5,
            transition: 'opacity 0.3s ease',
            backgroundColor: '#f8f9fa'
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
                {isLoading && <span style={{ color: '#037E63', marginLeft: '1rem' }}>⏳ Sincronizando...</span>}
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
                onClick={loadPointsFromBackend}
                disabled={isLoading}
                style={{
                  padding: '0.75rem 1.25rem',
                  backgroundColor: isLoading ? '#333333' : '#029B7B',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  opacity: isLoading ? 0.6 : 1
                }}
              >
                {isLoading ? '⏳ Carregando...' : '🔄 Recarregar'}
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
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
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
        </div>
      </div>
    </div>
  );
}