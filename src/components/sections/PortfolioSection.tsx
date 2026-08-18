"use client";

import React, { useRef } from 'react';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ReactLenis from "lenis/react";
import { cn } from "@/lib/utils";

interface DeckCard {
  id: number;
  title: string;
  category: string;
  image: string;
  year: string;
}

const DECK_CARDS: DeckCard[] = [
  {
    id: 1,
    title: "Spatial Chrome & Glass",
    category: "3D Motion & WebGL",
    year: "2025",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Cybernetic Fluidity",
    category: "Generative AI Systems",
    year: "2025",
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Chromatic Interface",
    category: "Fintech Platform",
    year: "2024",
    image: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Next-Gen Observability",
    category: "Enterprise Cloud Suite",
    year: "2024",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
  }
];

const StudioDeckSection = () => {
  const container = useRef<HTMLDivElement>(null);
  const stickyDeckRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = React.useState(0);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const cards = cardRefs.current;
      const total = cards.length;

      if (!cards[0] || !stickyDeckRef.current) return;

      gsap.set(cards[0], { y: "0%", scale: 1, opacity: 1 });

      for (let i = 1; i < total; i++) {
        if (!cards[i]) continue;
        gsap.set(cards[i], { y: "100%", scale: 1, opacity: 1 });
      }

      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: stickyDeckRef.current,
          start: "top top",
          end: `+=${window.innerHeight * (total - 0.5)}`,
          pin: true,
          scrub: 0.6,
          pinSpacing: true,
          onUpdate: (self) => {
            const idx = Math.min(Math.floor(self.progress * total * 0.99), total - 1);
            setActiveIndex(idx);
          }
        },
      });

      for (let i = 0; i < total - 1; i++) {
        const currentCard = cards[i];
        const nextCard = cards[i + 1];
        const position = i;
        if (!currentCard || !nextCard) continue;

        // Current card scales back subtly as deck layers
        scrollTimeline.to(
          currentCard,
          {
            scale: 0.92,
            y: "-3%",
            duration: 1,
            ease: "none",
          },
          position,
        );

        // Next card glides up smoothly into place
        scrollTimeline.to(
          nextCard,
          {
            y: "0%",
            scale: 1,
            duration: 1,
            ease: "none",
          },
          position,
        );
      }

      const resizeObserver = new ResizeObserver(() => {
        ScrollTrigger.refresh();
      });

      if (container.current) {
        resizeObserver.observe(container.current);
      }

      return () => {
        resizeObserver.disconnect();
        scrollTimeline.kill();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: container },
  );

  return (
    <div className="relative w-full bg-transparent pt-24 lg:pt-36" ref={container} style={{ width: '100%', overflowX: 'hidden' }}>
      {/* PERFECTLY CENTERED ICONIC HEADER */}
      <div 
        style={{
          width: '100%',
          maxWidth: '1280px',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: '24px',
          paddingRight: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          marginBottom: '56px'
        }}
      >
        {/* Subtle Studio Pill */}
        <div 
          style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '999px',
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            marginBottom: '20px'
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#050505' }} />
          <span style={{ color: '#52525b', fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'monospace' }}>
            Selected Works • 2024–2026
          </span>
        </div>
        
        {/* Signature Bold Headline */}
        <h2 
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#050505]"
          style={{ 
            letterSpacing: '-0.04em', 
            lineHeight: 1.05, 
            marginTop: 0,
            marginBottom: '20px',
            textAlign: 'center',
            width: '100%'
          }}
        >
          Featured Work.
        </h2>

        {/* Refined Subtitle */}
        <p 
          className="text-base sm:text-lg md:text-xl text-[#71717a] font-normal"
          style={{ 
            maxWidth: '600px', 
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: 0,
            marginBottom: 0,
            lineHeight: 1.6,
            textAlign: 'center'
          }}
        >
          A curated collection of high-impact digital experiences, spatial 3D platforms, and next-generation brand systems.
        </p>
      </div>

      {/* PINNED DECK VIEWPORT */}
      <div 
        ref={stickyDeckRef} 
        className="relative flex flex-col justify-center items-center h-[100vh] w-full overflow-hidden px-4 sm:px-8 lg:px-12 pb-8"
      >
        {/* DECK STACK CONTAINER */}
        <div className="w-full max-w-[1280px] h-[calc(100vh-120px)] relative flex items-center justify-center">
          {DECK_CARDS.map((card, i) => (
            <div 
              key={card.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="absolute inset-0 w-full h-full rounded-[28px] lg:rounded-[36px] overflow-hidden"
              style={{ 
                backgroundColor: '#ffffff',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.15)',
                transformOrigin: 'center bottom'
              }}
            >
              {/* Card Image Cover */}
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Top Right Dashed Circular Action Badge (Matches Original Design) */}
              <div 
                style={{
                  position: 'absolute',
                  top: '24px',
                  right: '24px',
                  zIndex: 20
                }}
              >
                <div 
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(12px)',
                    border: '2px dashed rgba(0, 0, 0, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.08) rotate(45deg)';
                    e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.8)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                    e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.35)';
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#050505" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
              </div>

              {/* Bottom Info Bar Overlay */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  padding: 'clamp(32px, 5vw, 60px) clamp(24px, 4vw, 48px)',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  gap: '24px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#D4D4D8', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                      0{i + 1} — {card.category}
                    </span>
                    <span style={{ color: '#A1A1AA', fontSize: '10px' }}>•</span>
                    <span style={{ fontSize: '12px', color: '#A1A1AA', fontFamily: 'monospace' }}>
                      {card.year}
                    </span>
                  </div>
                  <h3 style={{ color: '#FFFFFF', fontSize: 'clamp(2rem, 3.5vw, 3.2rem)', fontWeight: 700, margin: 0, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                    {card.title}
                  </h3>
                </div>

                <div 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    textDecoration: 'none'
                  }}
                >
                  <span>Explore Project</span>
                  <span>→</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default function PortfolioSection() {
  return (
    <>
      <StudioDeckSection />

      {/* LATEST INSIGHTS (Editorial / Journal) */}
      <section 
        id="insights-section"
        className="w-full relative z-20"
        style={{
          backgroundColor: "transparent",
          color: "#050505",
          paddingTop: "clamp(100px, 12vw, 160px)",
          paddingBottom: "clamp(100px, 12vw, 160px)",
          paddingLeft: "clamp(20px, 5vw, 60px)",
          paddingRight: "clamp(20px, 5vw, 60px)",
          borderTop: "1px solid rgba(0, 0, 0, 0.06)"
        }}
      >
        <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
          
          {/* Header Row */}
          <div 
            style={{ 
              display: "flex", 
              flexDirection: "row", 
              alignItems: "flex-end", 
              justifyContent: "space-between", 
              marginBottom: "clamp(48px, 6vw, 72px)",
              flexWrap: "wrap",
              gap: "24px"
            }}
          >
            <div>
              <div 
                style={{ 
                  display: "inline-flex", 
                  alignItems: "center", 
                  gap: "8px", 
                  padding: "6px 14px", 
                  borderRadius: "999px", 
                  backgroundColor: "rgba(0, 0, 0, 0.04)", 
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  marginBottom: "16px" 
                }}
              >
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#050505" }} />
                <span style={{ color: "#52525b", fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "monospace" }}>
                  Journal & Insights
                </span>
              </div>
              <h2 
                style={{ 
                  fontSize: "clamp(36px, 4.5vw, 56px)", 
                  fontWeight: 600, 
                  letterSpacing: "-0.03em", 
                  lineHeight: 1.1,
                  margin: 0,
                  color: "#09090b"
                }}
              >
                Latest Perspectives.
              </h2>
            </div>
            
            <a 
              href="#blog" 
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 20px",
                borderRadius: "999px",
                backgroundColor: "#f4f4f5",
                border: "1px solid rgba(0, 0, 0, 0.06)",
                fontSize: "13px",
                fontWeight: 600,
                color: "#18181b",
                textDecoration: "none",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#09090b";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#f4f4f5";
                e.currentTarget.style.color = "#18181b";
              }}
            >
              <span>Explore All Articles</span>
              <span style={{ fontSize: "14px" }}>→</span>
            </a>
          </div>

          {/* 3-Column Editorial Grid */}
          <div 
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "clamp(24px, 3vw, 36px)"
            }}
          >
            {[
              {
                id: 1,
                title: "The Architecture of Next-Gen WebGL Experiences",
                excerpt: "A deep dive into shader optimization, Three.js render pipelines, and building 60fps interactive web moments.",
                category: "Engineering",
                date: "Aug 12, 2026",
                readTime: "5 min read",
                image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop"
              },
              {
                id: 2,
                title: "Minimalism and Spatial Rhythm in Modern Commerce",
                excerpt: "How reducing visual clutter and introducing intentional white space drives higher checkout conversion rates.",
                category: "Design",
                date: "Aug 08, 2026",
                readTime: "4 min read",
                image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop"
              },
              {
                id: 3,
                title: "GSAP vs CSS: Orchestrating Complex Scroll Timelines",
                excerpt: "Benchmarking performance, memory overhead, and frame consistency when pinning multi-layered interface elements.",
                category: "Motion",
                date: "Jul 29, 2026",
                readTime: "6 min read",
                image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop"
              }
            ].map((article) => (
              <a
                key={article.id}
                href={`#article-${article.id}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "24px",
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  overflow: "hidden",
                  textDecoration: "none",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 20px 40px -15px rgba(0, 0, 0, 0.08)";
                  e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.18)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.08)";
                }}
              >
                {/* Image Wrap */}
                <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 10", overflow: "hidden", backgroundColor: "#f4f4f5" }}>
                  <img
                    src={article.image}
                    alt={article.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.5s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  />
                  {/* Category Pill Tag */}
                  <div 
                    style={{ 
                      position: "absolute", 
                      top: "16px", 
                      left: "16px", 
                      padding: "4px 12px", 
                      borderRadius: "999px", 
                      backgroundColor: "rgba(255, 255, 255, 0.9)", 
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                      fontSize: "11px", 
                      fontWeight: 600, 
                      color: "#18181b",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      fontFamily: "monospace"
                    }}
                  >
                    {article.category}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: "28px 24px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
                  <div>
                    {/* Meta */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#a1a1aa", fontFamily: "monospace", marginBottom: "12px" }}>
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>

                    {/* Title */}
                    <h3 
                      style={{ 
                        fontSize: "20px", 
                        fontWeight: 600, 
                        color: "#09090b", 
                        letterSpacing: "-0.02em", 
                        lineHeight: 1.3, 
                        margin: "0 0 10px 0" 
                      }}
                    >
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p style={{ fontSize: "14px", color: "#71717a", lineHeight: 1.6, margin: 0 }}>
                      {article.excerpt}
                    </p>
                  </div>

                  {/* Read Link */}
                  <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid rgba(0, 0, 0, 0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#09090b" }}>
                      Read Article
                    </span>
                    <div 
                      style={{ 
                        width: "28px", 
                        height: "28px", 
                        borderRadius: "50%", 
                        backgroundColor: "#f4f4f5", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center",
                        fontSize: "12px",
                        color: "#09090b"
                      }}
                    >
                      ↗
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
