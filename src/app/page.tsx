"use client";

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import ResearchBentoGrid from '@/components/ui/research-bento-grid';

import HeroSection from '@/components/sections/HeroSection';
import VideoPopover from '@/components/sections/VideoPopover';
import ServicesSection from '@/components/sections/ServicesSection';
import PortfolioSection from '@/components/sections/PortfolioSection';
import FAQSection from '@/components/sections/FAQSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import Footer from '@/components/sections/Footer';
import ProjectEstimationCalculator from '@/components/sections/ProjectEstimationCalculator';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Intercept refresh and scroll to top BEFORE the page unloads to prevent Next.js from saving deep scroll positions.
  useEffect(() => {
    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  useGSAP(() => {
    // Luxury Smooth Inertia Scroll (Lenis)
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.0,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(500, 33);

    // Force manual restoration to prevent native jitter
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    }

    // Mobile Menu JS
    const stage = document.getElementById('stage');
    const burger = document.getElementById('burger');
    const menu = document.getElementById('menu');
    const menuLinks = menu?.querySelectorAll('a');

    function toggleMenu() {
      const isOpen = stage?.classList.toggle('is-open');
      burger?.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      menu?.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      burger?.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    }

    burger?.addEventListener('click', toggleMenu);

    menuLinks?.forEach(link => {
      link.addEventListener('click', () => {
        if (stage?.classList.contains('is-open')) toggleMenu();
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && stage?.classList.contains('is-open')) {
        toggleMenu();
      }
    });

    // --- GSAP CANVAS SCRUBBER & INFINITE ZOOM ---
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const frameCount = 241;
    const currentFrame = (index: number) => (
      `assets/frames/frame_${(index + 1).toString().padStart(4, '0')}.jpg`
    );

    const images: HTMLImageElement[] = new Array(frameCount);
    const portal = { frame: 0 };
    let lastRenderedFrame = 0;

    function render() {
      if (!context || !canvas) return;
      const targetIdx = Math.min(frameCount - 1, Math.max(0, Math.round(portal.frame)));
      let img = images[targetIdx];
      if (!img || !img.complete || img.naturalWidth === 0) {
        if (images[lastRenderedFrame]?.complete && images[lastRenderedFrame]?.naturalWidth > 0) {
          img = images[lastRenderedFrame];
        } else if (images[0]?.complete && images[0]?.naturalWidth > 0) {
          img = images[0];
        }
      }
      if (img && img.complete && img.naturalWidth > 0) {
        lastRenderedFrame = targetIdx;
        context.clearRect(0, 0, canvas.width, canvas.height);
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio);

        const drawWidth = img.width * ratio + 2;
        const drawHeight = img.height * ratio + 2;

        const centerShift_x = (canvas.width - drawWidth) / 2;
        const centerShift_y = (canvas.height - drawHeight) / 2;

        context.drawImage(img, 0, 0, img.width, img.height,
          centerShift_x, centerShift_y, drawWidth, drawHeight);
      }
    }

    // Dismiss loader only after hero canvas is ready to prevent glitching
    let loaderDismissed = false;
    const dismissLoader = () => {
      if (loaderDismissed) return;
      loaderDismissed = true;
      render();
      gsap.to('#initial-loader', {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
          const loader = document.getElementById('initial-loader');
          if (loader) loader.style.display = 'none';
        }
      });
    };

    // 1. Load the first critical frame first
    const firstImg = new Image();
    firstImg.src = currentFrame(0);
    images[0] = firstImg;

    if (firstImg.complete && firstImg.naturalWidth > 0) {
      setTimeout(dismissLoader, 400);
    } else {
      firstImg.onload = () => {
        setTimeout(dismissLoader, 400);
      };
      firstImg.onerror = () => {
        dismissLoader();
      };
    }

    // Safety fallback: dismiss loader within 2s max on slow connections
    setTimeout(dismissLoader, 2000);

    // 2. Progressive background batch loading for remaining frames
    let currentBatchStart = 1;
    const batchSize = 12;

    const loadNextBatch = () => {
      if (currentBatchStart >= frameCount) return;
      const end = Math.min(currentBatchStart + batchSize, frameCount);
      for (let i = currentBatchStart; i < end; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images[i] = img;
      }
      currentBatchStart = end;
      if (currentBatchStart < frameCount) {
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(loadNextBatch, { timeout: 300 });
        } else {
          setTimeout(loadNextBatch, 80);
        }
      }
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(loadNextBatch, { timeout: 400 });
    } else {
      setTimeout(loadNextBatch, 200);
    }

    window.addEventListener('resize', () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        render();
      }
    });

    gsap.set(".plate-video", { scale: 1.0 });

    gsap.to(portal, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      onUpdate: render,
      duration: 10,
      repeat: -1
    });

    // =====================================================================
    // AUTOMATIC SCROLL-BOUND TRANSITION (SMOOTH & CONNECTED)
    // =====================================================================
    let isAnimating = false;
    let onVideoPage = false;
    let lastTransitionTime = 0;

    const zoomTimeline = gsap.timeline({
      paused: true,
      onComplete: () => {
        isAnimating = false;
        onVideoPage = true;
        lastTransitionTime = Date.now();
        document.body.style.pointerEvents = '';
        gsap.set('.door-left', { x: '-100%' });
        gsap.set('.door-right', { x: '100%' });
        gsap.set('.plate-video', { scale: 30 });
        gsap.set('.topbar, .hero, .logos', { opacity: 0 });
        document.body.classList.add('light-theme');
      },
      onReverseComplete: () => {
        isAnimating = false;
        onVideoPage = false;
        lastTransitionTime = Date.now();
        document.body.style.pointerEvents = '';
        gsap.set('.plate-video', { scale: 1 });
        gsap.set('.door-left', { x: '0%' });
        gsap.set('.door-right', { x: '0%' });
        gsap.set('.topbar, .hero, .logos', { opacity: 1 });
        document.body.classList.remove('light-theme');
      }
    });

    // 1. Fade out Hero UI
    zoomTimeline.to('.topbar, .hero, .logos', {
      opacity: 0, ease: 'power1.inOut', duration: 0.2
    }, 0);

    // 2. Zoom the video canvas in
    zoomTimeline.to('.plate-video', {
      scale: 30, ease: 'power3.in', duration: 0.5
    }, 0);

    // 3. Switch theme
    zoomTimeline.call(() => { document.body.classList.add('light-theme'); }, [], 0.3);

    // 4. Slide doors open to reveal the video page
    zoomTimeline.to('.door-left', { x: '-100%', ease: 'power2.inOut', duration: 0.35 }, 0.3);
    zoomTimeline.to('.door-right', { x: '100%', ease: 'power2.inOut', duration: 0.35 }, 0.3);

    // Initial position check on load
    if (typeof window !== 'undefined' && window.scrollY >= window.innerHeight * 0.5) {
      onVideoPage = true;
      gsap.set('.door-left', { x: '-100%' });
      gsap.set('.door-right', { x: '100%' });
      gsap.set('.plate-video', { scale: 30 });
      gsap.set('.topbar, .hero, .logos', { opacity: 0 });
      document.body.classList.add('light-theme');
    }

    function playForward() {
      if (isAnimating) return;
      isAnimating = true;
      document.body.style.pointerEvents = 'none';

      lenis.scrollTo('#main-content', {
        duration: 0.65,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        lock: true,
        onComplete: () => {
          isAnimating = false;
          onVideoPage = true;
          lastTransitionTime = Date.now();
          document.body.style.pointerEvents = '';
          gsap.set('.door-left', { x: '-100%' });
          gsap.set('.door-right', { x: '100%' });
          gsap.set('.plate-video', { scale: 30 });
          gsap.set('.topbar, .hero, .logos', { opacity: 0 });
          document.body.classList.add('light-theme');
        }
      });

      zoomTimeline.timeScale(1).play(0);
    }

    function playReverse() {
      if (isAnimating) return;
      isAnimating = true;
      document.body.style.pointerEvents = 'none';

      lenis.scrollTo(0, {
        duration: 0.65,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        lock: true,
        onComplete: () => {
          isAnimating = false;
          onVideoPage = false;
          lastTransitionTime = Date.now();
          document.body.style.pointerEvents = '';
          gsap.set('.plate-video', { scale: 1 });
          gsap.set('.door-left', { x: '0%' });
          gsap.set('.door-right', { x: '0%' });
          gsap.set('.topbar, .hero, .logos', { opacity: 1 });
          document.body.classList.remove('light-theme');
          zoomTimeline.pause(0);
        }
      });

      document.body.classList.remove('light-theme');

      gsap.timeline()
        .to('.door-left', { x: '0%', ease: 'power2.inOut', duration: 0.3 }, 0)
        .to('.door-right', { x: '0%', ease: 'power2.inOut', duration: 0.3 }, 0)
        .to('.plate-video', { scale: 1, ease: 'power3.out', duration: 0.45 }, 0.1)
        .to('.topbar, .hero, .logos', { opacity: 1, ease: 'power1.inOut', duration: 0.4 }, 0.15);
    }

    const handleWheel = (e: WheelEvent) => {
      if (isAnimating) {
        e.preventDefault();
        return;
      }
      if (Date.now() - lastTransitionTime < 300) {
        return;
      }

      const y = window.scrollY;
      const heroH = window.innerHeight;

      // In Hero area and scrolling down -> instantly auto-scroll & zoom to video player
      if (y < heroH - 10 && e.deltaY > 0) {
        e.preventDefault();
        playForward();
        return;
      }

      // At top of video/content section and scrolling up -> instantly auto-scroll & zoom back to Hero
      if (y <= heroH + 10 && e.deltaY < 0) {
        e.preventDefault();
        playReverse();
        return;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    // Strict snap check to guarantee user can NEVER be stopped in the halfway transition zone
    let snapTimer: ReturnType<typeof setTimeout> | null = null;
    const handleScroll = () => {
      if (isAnimating) return;
      if (Date.now() - lastTransitionTime < 300) return;

      const y = window.scrollY;
      const heroH = window.innerHeight;

      if (y > 5 && y < heroH - 5) {
        if (snapTimer) clearTimeout(snapTimer);
        snapTimer = setTimeout(() => {
          if (isAnimating) return;
          if (y >= heroH * 0.35) {
            playForward();
          } else {
            playReverse();
          }
        }, 40);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    lenis.on('scroll', handleScroll);

    // --- SHOWREEL VIDEO POPOVER LOGIC ---
    const thumbContainer = document.getElementById('video-thumbnail-container');
    const hoverPlay = document.getElementById('video-hover-play');
    const popover = document.getElementById('video-popover');
    const popoverBackdrop = document.getElementById('video-popover-backdrop');
    const popoverContent = document.getElementById('video-popover-content');
    const closePopoverBtn = document.getElementById('close-popover');
    const popoverVideo = document.getElementById('popover-video') as HTMLVideoElement;
    const thumbVideo = document.getElementById('thumbnail-video') as HTMLVideoElement;

    if (thumbVideo) {
      thumbVideo.playbackRate = 4.0;
    }

    if (hoverPlay && thumbContainer) {
      gsap.set(hoverPlay, { xPercent: -50, yPercent: -50 });
      const xSet = gsap.quickSetter(hoverPlay, "x", "px");
      const ySet = gsap.quickSetter(hoverPlay, "y", "px");

      thumbContainer.addEventListener('mousemove', (e) => {
        const rect = thumbContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        gsap.to(hoverPlay, { opacity: 1, duration: 0.2 });
        gsap.to(hoverPlay, {
          x: x,
          y: y,
          duration: 0.5,
          ease: "power3.out",
          overwrite: "auto"
        });
      });

      thumbContainer.addEventListener('mouseleave', () => {
        gsap.to(hoverPlay, { opacity: 0, duration: 0.2 });
      });
    }

    const openPopover = () => {
      if (popover && popoverBackdrop && popoverContent && popoverVideo) {
        popover.style.visibility = 'visible';
        popover.style.pointerEvents = 'auto';

        const tl = gsap.timeline();
        tl.to(popoverBackdrop, { opacity: 1, duration: 0.2 })
          .fromTo(popoverContent,
            { clipPath: "inset(43.5% 43.5% 33.5% 43.5%)", opacity: 0 },
            { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 1, ease: "elastic.out(1, 0.5)" },
            "<0.1"
          );

        popoverVideo.play();
      }
    };

    const closePopover = () => {
      if (popover && popoverBackdrop && popoverContent && popoverVideo) {
        const tl = gsap.timeline({
          onComplete: () => {
            popover.style.visibility = 'hidden';
            popover.style.pointerEvents = 'none';
          }
        });

        popoverVideo.pause();

        tl.to(popoverContent, {
          clipPath: "inset(43.5% 43.5% 33.5% 43.5%)",
          opacity: 0,
          duration: 0.6,
          ease: "power3.inOut"
        }).to(popoverBackdrop, { opacity: 0, duration: 0.2 }, "-=0.3");
      }
    };

    thumbContainer?.addEventListener('click', openPopover);
    popoverBackdrop?.addEventListener('click', closePopover);
    closePopoverBtn?.addEventListener('click', closePopover);

    // --- DIRECTIONAL CURSOR LOGIC ---
    const dirCursor = document.getElementById('video-directional-cursor');
    const dirArrow = document.getElementById('vdc-arrow');
    const showreelSection = document.querySelector('.video-showreel');

    if (dirCursor && dirArrow && showreelSection) {
      gsap.set(dirCursor, { xPercent: -50, yPercent: -50 });
      const setDirX = gsap.quickSetter(dirCursor, "x", "px");
      const setDirY = gsap.quickSetter(dirCursor, "y", "px");

      let inShowreel = false;
      let inThumbnail = false;

      showreelSection.addEventListener('mouseenter', () => { inShowreel = true; });
      showreelSection.addEventListener('mouseleave', () => {
        inShowreel = false;
        gsap.to(dirCursor, { opacity: 0, duration: 0.2 });
      });

      thumbContainer?.addEventListener('mouseenter', () => {
        inThumbnail = true;
        gsap.to(dirCursor, { opacity: 0, duration: 0.2 });
      });
      thumbContainer?.addEventListener('mouseleave', () => {
        inThumbnail = false;
      });

      window.addEventListener('mousemove', (e) => {
        if (inShowreel && !inThumbnail && popover?.style.pointerEvents !== 'auto') {
          gsap.to(dirCursor, { opacity: 1, duration: 0.2 });
          setDirX(e.clientX);
          setDirY(e.clientY);

          if (thumbContainer) {
            const rect = thumbContainer.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            let angle = Math.atan2(centerY - e.clientY, centerX - e.clientX);
            angle = angle * (180 / Math.PI);
            dirArrow.style.transform = `rotate(${angle}deg)`;
          }
        } else {
          gsap.to(dirCursor, { opacity: 0, duration: 0.2 });
        }
      });
    }

    // 1. Services Stacking Reveal
    gsap.utils.toArray('.service-card').forEach((card: any) => {
      gsap.fromTo(card,
        { opacity: 0, y: 100 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: {
            trigger: card, start: "top 85%", toggleActions: "play none none reverse"
          }
        }
      );
    });

    // 2. Portfolio Horizontal Scroll
    const portfolioWrapper = document.querySelector('.portfolio-horizontal-wrapper');
    const portfolioContainer = document.querySelector('.portfolio-container');

    if (portfolioWrapper && portfolioContainer) {
      gsap.to(portfolioContainer, {
        x: () => -(portfolioContainer.scrollWidth - window.innerWidth + window.innerWidth * 0.12),
        ease: "none",
        scrollTrigger: {
          trigger: portfolioWrapper,
          pin: true,
          scrub: 1,
          start: "center center",
          end: () => "+=" + (portfolioContainer.scrollWidth),
          invalidateOnRefresh: true
        }
      });
    }

    // 3. Testimonials Marquee
    const marquee = document.querySelector('.marquee');
    if (marquee) {
      gsap.to(marquee, {
        xPercent: -50, ease: "none",
        scrollTrigger: { trigger: ".testimonials-section", start: "top bottom", end: "bottom top", scrub: 1 }
      });
    }

    // 4. Parallax Footer Reveal
    gsap.fromTo('.footer-content',
      { scale: 0.9, opacity: 0 },
      {
        scale: 1, opacity: 1, ease: "none",
        scrollTrigger: {
          trigger: "#main-content", start: "bottom 95%", end: "bottom top", scrub: true
        }
      }
    );

    // 6. Media Strip Infinite & Skew
    const mediaStrip = document.querySelector('.media-strip');
    if (mediaStrip) {
      gsap.to(mediaStrip, { xPercent: -50, ease: "none", duration: 20, repeat: -1 });
    }

    // 7. News Hover Image Tracking
    const newsItems = document.querySelectorAll('.news-item');
    const hoverImage = document.querySelector('.news-hover-image') as HTMLElement;

    if (hoverImage) {
      const setHoverX = gsap.quickSetter(hoverImage, "x", "px");
      const setHoverY = gsap.quickSetter(hoverImage, "y", "px");

      window.addEventListener('mousemove', (e) => {
        setHoverX(e.clientX);
        setHoverY(e.clientY);
      });

      newsItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
          const imgSrc = item.getAttribute('data-image');
          if (imgSrc) {
            hoverImage.style.backgroundImage = `url(${imgSrc})`;
            hoverImage.classList.add('active');
          }
        });
        item.addEventListener('mouseleave', () => {
          hoverImage.classList.remove('active');
        });
      });
    }

    // 8. FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

      question?.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          gsap.to(otherItem.querySelector('.faq-answer'), { height: 0, opacity: 0, duration: 0.4, ease: "power2.out" });
        });

        if (!isActive) {
          item.classList.add('active');
          gsap.set(answer, { height: "auto" });
          const fullHeight = (answer as HTMLElement).offsetHeight;
          gsap.fromTo(answer, { height: 0, opacity: 0 }, { height: fullHeight, opacity: 1, duration: 0.4, ease: "power2.out" });
        }
      });
    });

    // 9. Full Website Ultra-Smooth Scroll Stroke (ClipPath — follows the point exactly)
    const strokePath = document.getElementById('global-scroll-stroke-path') as SVGPathElement | null;
    const strokeDot = document.getElementById('global-scroll-stroke-dot') as SVGCircleElement | null;
    const strokeDotGlow = document.getElementById('global-scroll-stroke-dot-glow') as SVGCircleElement | null;
    const strokeClipRect = document.getElementById('stroke-clip-rect') as SVGRectElement | null;

    let updateGlobalStroke: (() => void) | null = null;
    let strokeRafId: number | null = null;

    if (strokePath) {
      const totalLength = strokePath.getTotalLength();
      const mainEl = document.getElementById('main-content');

      updateGlobalStroke = () => {
        if (!mainEl) return;
        
        if (strokeRafId !== null) {
          cancelAnimationFrame(strokeRafId);
        }
        
        strokeRafId = requestAnimationFrame(() => {
          const rect = mainEl.getBoundingClientRect();
          const elHeight = mainEl.offsetHeight;
          if (elHeight <= 0) return;

          // Position the follow point at 55% of the viewport
          const viewportLead = window.innerHeight * 0.55;
          const scrolledInElement = viewportLead - rect.top;
          const progress = Math.min(1, Math.max(0, scrolledInElement / elHeight));

          // Get the point's exact position on the path
          const currentLength = totalLength * progress;
          const pt = strokePath.getPointAtLength(Math.min(totalLength, Math.max(0, currentLength)));

          // Move the dot to that position
          if (strokeDot) {
            strokeDot.setAttribute('cx', String(pt.x));
            strokeDot.setAttribute('cy', String(pt.y));
          }
          if (strokeDotGlow) {
            strokeDotGlow.setAttribute('cx', String(pt.x));
            strokeDotGlow.setAttribute('cy', String(pt.y));
          }

          // Clip the line to the dot's Y — line is visible from top down to where the dot is
          if (strokeClipRect) {
            strokeClipRect.setAttribute('height', String(pt.y + 30));
          }
        });
      };

      window.addEventListener('scroll', updateGlobalStroke, { passive: true });
      window.addEventListener('resize', updateGlobalStroke, { passive: true });
      updateGlobalStroke();
    }

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tickerCallback);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      if (updateGlobalStroke) {
        window.removeEventListener('scroll', updateGlobalStroke);
        window.removeEventListener('resize', updateGlobalStroke);
      }
    };
  }, { scope: containerRef });

  return (
    <main className="bg-[#f7f7f5] text-[#1d1d1f] font-sans antialiased overflow-x-hidden min-h-screen relative">
      {/* INITIAL LOADER to prevent flash of unstyled/scrolled content */}
      <div
        id="initial-loader"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#f7f7f5',
          zIndex: 99999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'opacity 0.6s ease-out, visibility 0.6s ease-out',
        }}
      >
        <div className="loader">
          <span><span></span><span></span><span></span><span></span></span>
          <div className="base">
            <span></span>
            <div className="face"></div>
          </div>
        </div>
        <div className="longfazers">
          <span></span><span></span><span></span><span></span>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div ref={containerRef} className="min-h-screen bg-[#eeeeeb] text-black font-sans">


        <HeroSection canvasRef={canvasRef} />

        <main id="main-content" style={{ position: 'relative', zIndex: 20, background: '#eeeeeb', width: '100%' }}>
          {/* Full-Website Smooth Scroll Stroke Overlay (Behind Content) */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden" style={{ minHeight: '100%' }}>
            <svg
              className="w-full h-full absolute inset-0 pointer-events-none"
              viewBox="0 0 1200 6000"
              fill="none"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <clipPath id="stroke-clip">
                  <rect id="stroke-clip-rect" x="0" y="0" width="1200" height="0" />
                </clipPath>
              </defs>
              {/* Single simple solid line */}
              <path
                id="global-scroll-stroke-path"
                d="M 600 40 
                   C 850 180, 1050 380, 850 580 
                   C 650 780, 300 880, 240 1080 
                   C 180 1280, 480 1480, 780 1680 
                   C 1080 1880, 1120 2100, 880 2300 
                   C 640 2500, 220 2680, 180 2900 
                   C 140 3120, 520 3300, 880 3480 
                   C 1140 3660, 1100 3920, 800 4100 
                   C 500 4280, 160 4440, 200 4680 
                   C 240 4920, 620 5080, 920 5240 
                   C 1120 5400, 1060 5600, 780 5760 
                   C 500 5920, 350 5960, 600 5990"
                stroke="#c6e829"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                clipPath="url(#stroke-clip)"
              />
            </svg>
          </div>

          {/* Foreground Content (Above Scroll Path) */}
          <div className="relative z-10">
            <ServicesSection />
            <PortfolioSection />
            <ProjectEstimationCalculator />
            <FAQSection />
            <TestimonialsSection />
          </div>
        </main>

        <Footer />
        <VideoPopover />

        <div id="video-directional-cursor" style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.875rem', fontWeight: 500, color: 'white', mixBlendMode: 'exclusion', opacity: 0 }}>
          <svg id="vdc-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(0deg)', transition: 'transform 0.2s' }}>
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
          <span>Play</span>
        </div>
      </div>
    </main>
  );
}
