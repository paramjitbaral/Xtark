"use client";

import React, { useRef, useState } from 'react';
import ResearchBentoGrid from '@/components/ui/research-bento-grid';
import { OurExpertiseSection } from './OurExpertiseSection';

function GlowCard({ num, title, desc, className }: any) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`group relative overflow-hidden rounded-3xl border border-black/5 bg-[#fcfcfc] p-10 md:p-16 flex flex-col justify-between transition-all duration-500 hover:border-black/10 hover:shadow-2xl hover:-translate-y-1 ${className}`}
      style={{ minHeight: '480px' }}
    >
      {/* Mouse Glow Orb */}
      <div 
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(900px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(237, 255, 0, 0.25), transparent 40%)`,
        }}
      />
      
      <div className="relative z-10 flex justify-between items-start">
        <span className="text-8xl md:text-9xl font-black text-black/[0.03] tracking-tighter group-hover:text-black/[0.06] transition-colors duration-500">{num}</span>
        
        <div className="w-16 h-16 rounded-full border border-black/10 flex items-center justify-center text-black/30 transition-all duration-500 group-hover:bg-[#edff00] group-hover:text-black group-hover:border-[#edff00] group-hover:scale-110 shadow-sm">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform -rotate-45 group-hover:rotate-0 transition-transform duration-500">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </div>
      </div>

      <div className="relative z-10 mt-auto pt-20">
        <h3 className="text-4xl md:text-6xl font-bold text-[#1d1d1f] tracking-tight mb-6">{title}</h3>
        <p className="text-[#5e5e5e] text-xl leading-relaxed max-w-xl">{desc}</p>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  return (
    <>
      <div className="sliding-doors" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 50, pointerEvents: 'none', display: 'flex' }}>
        <div className="door-left" style={{ width: '50%', height: '100%', background: '#eeeeeb', transform: 'translateX(0%)' }}></div>
        <div className="door-right" style={{ width: '50%', height: '100%', background: '#eeeeeb', transform: 'translateX(0%)' }}></div>
      </div>

      <section className="video-showreel" style={{ position: 'relative', display: 'flex', flexDirection: 'column', width: '100%', height: '100vh', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', gap: '40px' }}>
        <div style={{ display: 'grid', justifyItems: 'center', textAlign: 'center', gap: '24px', zIndex: 10 }}>
          <span style={{ position: 'relative', maxWidth: '12ch', fontSize: '0.75rem', textTransform: 'uppercase', lineHeight: 1.25, opacity: 0.4, color: '#050505' }}>
            Click the video to play
            <span style={{ position: 'absolute', left: '50%', top: '100%', height: '64px', width: '1px', background: 'linear-gradient(to bottom, transparent, var(--ink))' }}></span>
          </span>
        </div>

        <div id="video-thumbnail-container" style={{ width: '16vw', height: '16vw', minWidth: '120px', minHeight: '120px', position: 'relative', cursor: 'pointer', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
          <div id="video-hover-play" style={{ position: 'absolute', top: 0, left: 0, zIndex: 20, display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px', fontSize: '0.875rem', color: 'white', mixBlendMode: 'exclusion', userSelect: 'none', pointerEvents: 'none', opacity: 0, fontWeight: 500 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 3L19 12L5 21V3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Play
          </div>
          <video id="thumbnail-video" autoPlay muted playsInline loop style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}>
            <source src="assets/VideoXtark.mp4" type="video/mp4" />
          </video>
        </div>
      </section>


      {/* Integrated Research Bento Grid */}
      <section className="w-full h-[850px] bg-transparent">
         <ResearchBentoGrid />
      </section>

      {/* Parallax Section (Replaced Our Expertise) */}
      <OurExpertiseSection />

      <section className="content-section" style={{ position: 'relative', opacity: 1, pointerEvents: 'auto', backgroundColor: 'transparent', color: '#050505', paddingTop: '80px', paddingBottom: '80px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <div className="content-grid">
          <div className="content-left">
            <h2 style={{ color: '#050505' }}>The Next Era<br />of Digital.</h2>
          </div>
          <div className="content-right">
            <p style={{ color: '#5e5e5e' }}>Step into a new dimension of digital presence. We craft high-performance, immersive websites engineered for scale and tailored for your business success.</p>
            <div className="stats">
              <div className="stat">
                <h3 style={{ color: '#050505' }}>150+</h3>
                <span style={{ color: '#5e5e5e' }}>Projects Delivered</span>
              </div>
              <div className="stat">
                <h3 style={{ color: '#050505' }}>AWWWARDS</h3>
                <span style={{ color: '#5e5e5e' }}>Winning Designs</span>
              </div>
              <div className="stat">
                <h3 style={{ color: '#050505' }}>99%</h3>
                <span style={{ color: '#5e5e5e' }}>Client Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
