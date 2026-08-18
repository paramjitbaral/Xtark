"use client";

import React from 'react';
import Header from './Header';

interface HeroSectionProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export default function HeroSection({ canvasRef }: HeroSectionProps) {
  return (
    <div id="hero-pin-wrapper" style={{ height: '100vh', position: 'relative' }}>
      <div className="hero-sticky-container" style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', zIndex: 10, overflow: 'hidden' }}>
        <div className="stage" id="stage">
          <div className="white-flash" style={{ position: 'absolute', inset: 0, background: 'white', opacity: 0, zIndex: 5, pointerEvents: 'none' }}></div>
          
          <div className="plate">
            <canvas ref={canvasRef} className="plate-video" id="hero-lightpass" width="1920" height="1080" style={{ width: '100%', height: '100%', objectFit: 'cover' }}></canvas>
          </div>

          <Header />

          <main className="hero">
            <div className="hero-left">
              <h1 className="headline">
                <span>Crafting Digital</span>
                <span>Excellence</span>
              </h1>
              <p className="sub-left">Award-winning Web Development Agency</p>
            </div>
            <div className="hero-right">
              <p className="sub">
                <span>We build modern, premium, high-quality websites</span>
                <span>to establish your strong digital presence.</span>
              </p>
              <div className="actions">
                <a href="#" className="pill pill-cta"><span>Start Project</span></a>
                <a href="#" className="ghost">Our Services</a>
              </div>
            </div>
          </main>

          <div className="logos">
            <div className="lg lg1">
              <svg viewBox="0 0 30 31" aria-hidden="true">
                <mask id="bite1">
                  <rect width="100%" height="100%" fill="white" />
                  <circle cx="19.5" cy="10.5" r="5.1" fill="black" />
                </mask>
                <path d="M15 1A14 14 0 1 1 1 15 14 14 0 0 1 15 1Z" mask="url(#bite1)" />
                <circle cx="19.5" cy="10.5" r="3.5" />
              </svg>
              <span className="word">logoipsum</span>
            </div>
            <div className="lg lg2">
              <svg viewBox="0 0 25 30" aria-hidden="true">
                <rect x="0" y="5" width="8" height="20" rx="4" />
                <path d="M12 15a7.5 7.5 0 1 1 15 0 7.5 7.5 0 0 1-15 0zm0 0a7.5 7.5 0 1 0 15 0 7.5 7.5 0 0 0-15 0z" clipPath="inset(0 50% 0 0)" />
                <circle cx="19.5" cy="15" r="7.5" />
                <circle cx="19.5" cy="15" r="3" fill="#050505" />
              </svg>
              <span className="word">logoipsum<span className="dot"></span></span>
            </div>
            <div className="lg lg3">
              <svg viewBox="0 0 28 28" aria-hidden="true" strokeWidth="3.1">
                <circle cx="14" cy="14" r="12.35" />
                <path d="M7 14 Q 14 7, 21 14" strokeLinecap="round" />
                <path d="M7 14 Q 14 21, 21 14" strokeLinecap="round" />
              </svg>
              <span className="word">logoipsum</span>
            </div>
            <div className="lg lg4">
              <svg viewBox="0 0 28 25.5" aria-hidden="true">
                <path d="M2 12 Q 7 2, 14 12 T 26 12 L 26 25 L 2 25 Z" fill="currentColor" stroke="none" />
                <path d="M2 18 Q 7 8, 14 18 T 26 18" stroke="currentColor" strokeWidth="3.05" fill="none" strokeLinecap="round" />
              </svg>
              <span className="word">logoipsum</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
