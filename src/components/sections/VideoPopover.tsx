"use client";

import React from 'react';

export default function VideoPopover() {
  return (
    <div id="video-popover" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', visibility: 'hidden', pointerEvents: 'none' }}>
      <div id="video-popover-backdrop" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#000', opacity: 0, cursor: 'pointer' }}></div>
      <div id="video-popover-content" style={{ position: 'relative', width: '100vw', height: '100vh', opacity: 0, clipPath: 'inset(43.5% 43.5% 33.5% 43.5%)', overflow: 'hidden', background: '#000' }}>
        <video id="popover-video" style={{ width: '100%', height: '100%', objectFit: 'cover', outline: 'none' }}>
          <source src="assets/VideoXtark.mp4" type="video/mp4" />
        </video>
        <span id="close-popover" style={{ position: 'absolute', right: '32px', top: '32px', zIndex: 50, cursor: 'pointer', color: 'rgba(255,255,255,0.6)', transition: 'color 0.3s' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </span>
      </div>
    </div>
  );
}
