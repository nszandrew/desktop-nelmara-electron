// src/pages/GalleryPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import Sidebar from "./Sidebar";

const COLORS = {
  green900: "#025C4A",
  green800: "#037E63",
  green700: "#029B7B",
  green500: "#00C9A7",
  gray900: "#333333",
  gray100: "#F5F5F5",
  white: "#FFFFFF",
};

const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${COLORS.gray100};
  font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
`;

const Content = styled.main`
  margin-left: 70px;
  width: 100%;
  padding: 2rem;
`;

const Card = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  background: ${COLORS.white};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1rem;
  margin-bottom: 1.25rem;
  border-bottom: 2px solid ${COLORS.green500};
`;

const Title = styled.h1`
  margin: 0;
  color: ${COLORS.green900};
  font-weight: 700;
  font-size: 1.6rem;
`;

const Sub = styled.p`
  margin: 0.35rem 0 0 0;
  color: ${COLORS.gray900};
  opacity: 0.8;
`;

const floatY = keyframes`
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
`;

const CarouselWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ArrowBtn = styled.button`
  border: none;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: ${COLORS.green800};
  color: ${COLORS.white};
  display: grid;
  place-items: center;
  box-shadow: 0 6px 18px rgba(2, 92, 74, 0.25);
  transition: transform 0.15s ease, filter 0.15s ease;
  z-index: 2; /* garante que fique acima do carrossel */
  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.05);
  }
`;

const Track = styled.div`
  flex: 1;
  overflow-x: auto; /* ← troca de hidden pra auto */
  overflow-y: hidden;
  scroll-behavior: smooth;
  padding-bottom: 10px;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Row = styled.div`
  display: flex;
  gap: 0.9rem;
  width: max-content;
`;

const Thumb = styled.button`
  width: 140px;
  height: 100px;
  border: none;
  cursor: pointer;
  border-radius: 14px;
  overflow: hidden;
  background: ${COLORS.gray100};
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.06);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    animation: ${floatY} 4s ease-in-out infinite;
  }
`;

const Viewer = styled.div`
  margin-top: 1.25rem;
  background: ${COLORS.gray100};
  border-radius: 12px;
  border: 1px solid #e9ecef;
  padding: 1.25rem;
  display: grid;
  place-items: center;
`;

const MainImage = styled.img`
  width: min(100%, 980px);
  max-height: 72vh;
  object-fit: contain;
  border-radius: 12px;
  background: #fafafa;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  cursor: zoom-in;
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(2, 92, 74, 0.25);
  display: grid;
  place-items: center;
  backdrop-filter: blur(3px);
`;

const Lightbox = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  max-width: 100%;
  max-height: 100%;
  background: ${COLORS.white};
  border-radius: 0; /* ocupa tela toda */
  overflow: hidden;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
  border: none;
  display: flex;
  flex-direction: column;
`;

const LightboxBody = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${COLORS.gray100};
  overflow: auto; /* permite rolar se imagem for muito grande */
`;

const LightboxImg = styled.img`
  max-width: 98%;
  max-height: 90vh; /* imagem nunca passa do viewport */
  object-fit: contain;
  border-radius: 8px;
  margin: auto;
  display: block;
`;

const LightboxTop = styled.div`
  flex: 0 0 56px;
  background: linear-gradient(90deg, ${COLORS.green800}, ${COLORS.green700});
  color: ${COLORS.white};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  font-weight: 600;
  letter-spacing: 0.02em;
`;



const Close = styled.button`
  border: none;
  background: rgba(255, 255, 255, 0.12);
  color: ${COLORS.white};
  width: 36px;
  height: 36px;
  border-radius: 10px;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: transform 0.12s ease, background 0.12s ease;
  &:hover {
    transform: scale(1.04);
    background: rgba(255, 255, 255, 0.22);
  }
`;

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function GalleryPage() {
  const images = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        src: `/assets/${i + 1}.png`,
      })),
    []
  );

  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);
  const trackRef = useRef(null);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  useEffect(() => {
    const onKey = (e) => {
      if (!open) return;
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowLeft")
        setCurrent((c) => clamp(c - 1, 0, images.length - 1));
      if (e.key === "ArrowRight")
        setCurrent((c) => clamp(c + 1, 0, images.length - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, images.length]);

  return (
    <Wrapper>
      <Sidebar />
      <Content>
        <Card>
          <Header>
            <div>
              <Title>RMA - 1</Title>
              <Sub>Visualize as imagens em carrossel e clique para ampliar.</Sub>
            </div>
          </Header>

          {/* 🟢 agora os botões realmente funcionam */}
          <CarouselWrap>
            <ArrowBtn onClick={() => scrollBy(-1)}>
              <FaChevronLeft />
            </ArrowBtn>

            <Track ref={trackRef}>
              <Row>
                {images.map((img, i) => (
                  <Thumb
                    key={i}
                    onClick={() => {
                      setCurrent(i);
                      setOpen(true);
                    }}
                  >
                    <img src={img.src} alt={`Imagem ${i + 1}`} />
                  </Thumb>
                ))}
              </Row>
            </Track>

            <ArrowBtn onClick={() => scrollBy(1)}>
              <FaChevronRight />
            </ArrowBtn>
          </CarouselWrap>

          <Viewer>
            <MainImage
              src={images[current].src}
              alt={`Imagem ${current + 1}`}
              onClick={() => setOpen(true)}
            />
          </Viewer>
        </Card>

        {open && (
          <Backdrop onClick={() => setOpen(false)}>
            <Lightbox onClick={(e) => e.stopPropagation()}>
              <LightboxTop>
                <span>
                  Imagem {current + 1} / {images.length}
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <ArrowBtn
                    onClick={() =>
                      setCurrent((c) => clamp(c - 1, 0, images.length - 1))
                    }
                  >
                    <FaChevronLeft />
                  </ArrowBtn>
                  <ArrowBtn
                    onClick={() =>
                      setCurrent((c) => clamp(c + 1, 0, images.length - 1))
                    }
                  >
                    <FaChevronRight />
                  </ArrowBtn>
                  <Close onClick={() => setOpen(false)}>
                    <FaTimes />
                  </Close>
                </div>
              </LightboxTop>

              <LightboxBody>
                <LightboxImg
                  src={images[current].src}
                  alt={`Imagem ${current + 1}`}
                />
              </LightboxBody>
            </Lightbox>
          </Backdrop>
        )}
      </Content>
    </Wrapper>
  );
}
