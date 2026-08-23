import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import LoadingScreen from "./components/LoadingScreen";
import Navbar from "./components/Navbar";

// Page Components
import Home from "./pages/Home";
import Work from "./pages/Work";
import About from "./pages/About";
import Calculator from "./pages/Calculator";
import HowWeWork from "./pages/HowWeWork";
import Journal from "./pages/Journal";
import Explorations from "./pages/Explorations";
import Contact from "./pages/Contact";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<0 | 1>(0); // 0 = Home, 1 = Main Site
  const [navPage, setNavPage] = useState(0); // Tracks current section for Navbar
  
  const isTransitioningRef = useRef(false);
  const scrollCooldownRef = useRef(false);

  // Lenis Smooth Scrolling Setup for View 1
  useEffect(() => {
    if (activeView !== 1) return;

    const wrapper = document.getElementById("page-container-1");
    const content = document.getElementById("page-content-1");

    if (!wrapper || !content) return;

    const lenis = new Lenis({
      wrapper: wrapper,
      content: content,
      lerp: 0.08,
      wheelMultiplier: 1.1,
      smoothWheel: true,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);
    (window as any).lenisInstance = lenis;

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as any).lenisInstance;
    };
  }, [activeView]);

  // Intersection Observer for Navbar tracking in View 1
  useEffect(() => {
    if (activeView !== 1) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute("data-index") || "1", 10);
            setNavPage(index);
          }
        });
      },
      {
        root: document.getElementById("page-container-1"),
        threshold: 0.2, // Lower threshold for huge parallax sections
      }
    );

    const sections = document.querySelectorAll(".section-observer");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [activeView]);

  const handleNavClick = (index: number) => {
    if (isTransitioningRef.current) return;
    
    if (index === 0) {
      if (activeView !== 0) {
        triggerTransition(1, 0);
      }
    } else {
      if (activeView === 0) {
        triggerTransition(0, 1, index);
      } else {
        scrollToSection(index);
      }
    }
  };

  const scrollToSection = (index: number) => {
    const targetSection = document.getElementById(`section-${index}`);
    const lenis = (window as any).lenisInstance;
    
    if (lenis && targetSection) {
      lenis.scrollTo(targetSection, { duration: 1.2 });
      setNavPage(index);
    } else {
      const container = document.getElementById("page-container-1");
      if (container && targetSection) {
        container.scrollTo({
          top: targetSection.offsetTop,
          behavior: "smooth"
        });
        setNavPage(index);
      }
    }
  };

  const triggerTransition = (from: number, to: number, targetSectionIndex?: number) => {
    if (from === to) return;
    isTransitioningRef.current = true;

    const fromEl = document.getElementById(`page-wrapper-${from}`);
    const toEl = document.getElementById(`page-wrapper-${to}`);
    
    if (!fromEl || !toEl) {
      setActiveView(to as 0 | 1);
      if (to === 0) setNavPage(0);
      isTransitioningRef.current = false;
      return;
    }

    gsap.killTweensOf([fromEl, toEl]);

    // Prepare destination scroll positions
    if (to === 1) {
      if (targetSectionIndex) {
        const container = document.getElementById("page-container-1");
        const targetSection = document.getElementById(`section-${targetSectionIndex}`);
        if (container && targetSection) container.scrollTop = targetSection.offsetTop;
        setNavPage(targetSectionIndex);
      } else {
        const container = document.getElementById("page-container-1");
        if (container) container.scrollTop = 0;
        setNavPage(1);
      }
    } else {
      setNavPage(0);
    }

    const onComplete = () => {
      gsap.set(fromEl, { display: "none", clearProps: "all" });
      gsap.set(toEl, { clearProps: "all" });
      setActiveView(to as 0 | 1);
      isTransitioningRef.current = false;
    };

    const isForward = to > from;
    const isMobile = window.innerWidth < 768;

    const tl = gsap.timeline({ onComplete });
    
    if (isMobile) {
      // SMOOTH VERTICAL SLIDE (Continuous scroll feeling)
      if (isForward) {
        gsap.set(toEl, { display: "block", zIndex: 10, opacity: 1, yPercent: 100, xPercent: 0, rotate: 0, scale: 1 });
        gsap.set(fromEl, { zIndex: 5 });
        tl.to(fromEl, { yPercent: -30, opacity: 0, duration: 0.7, ease: "power3.inOut" })
          .to(toEl, { yPercent: 0, duration: 0.7, ease: "power3.inOut" }, "<");
      } else {
        gsap.set(toEl, { display: "block", zIndex: 5, opacity: 0, yPercent: -30, xPercent: 0, rotate: 0, scale: 1 });
        gsap.set(fromEl, { zIndex: 10, yPercent: 0 });
        tl.to(fromEl, { yPercent: 100, duration: 0.7, ease: "power3.inOut" })
          .to(toEl, { yPercent: 0, opacity: 1, duration: 0.7, ease: "power3.inOut" }, "<");
      }
    } else {
      // SKEWED EDITORIAL SLIDE (Desktop only)
      if (isForward) {
        gsap.set(toEl, { display: "block", zIndex: 10, xPercent: 100, rotate: -6, scale: 1.08, transformOrigin: "50% 50%" });
        gsap.set(fromEl, { zIndex: 5, transformOrigin: "50% 50%" });
        tl.to(fromEl, { xPercent: -100, rotate: 6, scale: 0.9, duration: 0.85, ease: "power3.inOut" })
          .to(toEl, { xPercent: 0, rotate: 0, scale: 1, duration: 0.85, ease: "power3.inOut" }, "<");
      } else {
        gsap.set(toEl, { display: "block", zIndex: 5, xPercent: -100, rotate: 6, scale: 0.9, transformOrigin: "50% 50%" });
        gsap.set(fromEl, { zIndex: 10, xPercent: 0, rotate: 0, scale: 1, transformOrigin: "50% 50%" });
        tl.to(fromEl, { xPercent: 100, rotate: -6, scale: 1.08, duration: 0.85, ease: "power3.inOut" })
          .to(toEl, { xPercent: 0, rotate: 0, scale: 1, duration: 0.85, ease: "power3.inOut" }, "<");
      }
    }
  };

  // Wheel tracking specifically for navigating between Home (0) and Main (1) when at top
  useEffect(() => {
    if (isLoading) return;

    const handleWheel = (e: WheelEvent) => {
      if (isTransitioningRef.current || scrollCooldownRef.current) return;

      const currentContainer = document.getElementById(`page-container-${activeView}`);
      if (!currentContainer) return;

      const deltaY = e.deltaY;

      if (deltaY > 0) {
        // Scroll Down
        if (activeView === 0) {
          const isAtBottom = currentContainer.scrollTop + currentContainer.clientHeight >= currentContainer.scrollHeight - 2;
          if (isAtBottom) {
            e.preventDefault();
            scrollCooldownRef.current = true;
            triggerTransition(0, 1, 1);
            setTimeout(() => { scrollCooldownRef.current = false; }, 1100);
          }
        }
      } else {
        // Scroll Up
        if (activeView === 1) {
          const isAtTop = currentContainer.scrollTop <= 1;
          if (isAtTop) {
            e.preventDefault();
            scrollCooldownRef.current = true;
            triggerTransition(1, 0);
            setTimeout(() => { scrollCooldownRef.current = false; }, 1100);
          }
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [isLoading, activeView]);

  // Touch swipes support for transition
  useEffect(() => {
    if (isLoading) return;

    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isTransitioningRef.current || scrollCooldownRef.current) return;

      const currentContainer = document.getElementById(`page-container-${activeView}`);
      if (!currentContainer) return;

      const deltaY = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) < 50) return;

      if (deltaY > 0) {
        // Swipe Up -> Scroll Down
        if (activeView === 0) {
          const isAtBottom = currentContainer.scrollTop + currentContainer.clientHeight >= currentContainer.scrollHeight - 2;
          if (isAtBottom) {
            scrollCooldownRef.current = true;
            triggerTransition(0, 1, 1);
            setTimeout(() => { scrollCooldownRef.current = false; }, 1100);
          }
        }
      } else {
        // Swipe Down -> Scroll Up
        if (activeView === 1) {
          const isAtTop = currentContainer.scrollTop <= 1;
          if (isAtTop) {
            scrollCooldownRef.current = true;
            triggerTransition(1, 0);
            setTimeout(() => { scrollCooldownRef.current = false; }, 1100);
          }
        }
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isLoading, activeView]);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>
      
      <div className="relative bg-bg min-h-screen text-text-primary selection:bg-white selection:text-black overflow-hidden w-screen h-screen">
          <Navbar activePage={navPage} goToPage={handleNavClick} />
          
          {/* View 0: Home */}
          <div
            id="page-wrapper-0"
            className="fixed inset-0 w-full h-full"
            style={{
              zIndex: activeView === 0 ? 10 : 1,
              display: activeView === 0 ? "block" : "none",
            }}
          >
            <div
              id="page-container-0"
              className="w-full h-full overflow-y-auto overflow-x-hidden scroll-smooth overscroll-none"
            >
              <Home goToPage={handleNavClick} isActive={navPage === 0} />
            </div>
          </div>

          {/* View 1: Main Site */}
          <div
            id="page-wrapper-1"
            className="fixed inset-0 w-full h-full bg-black"
            style={{
              zIndex: activeView === 1 ? 10 : 1,
              display: activeView === 1 ? "block" : "none",
            }}
          >
            <div
              id="page-container-1"
              className="w-full h-full overflow-y-auto overflow-x-hidden scroll-smooth overscroll-none"
            >
              <div id="page-content-1" className="w-full min-h-full">
                <section id="section-1" data-index="1" className="w-full relative section-observer">
                  <Explorations isActive={navPage === 1} isViewActive={activeView === 1} />
                </section>
                <section id="section-2" data-index="2" className="w-full relative section-observer">
                  <Work />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none z-50" />
                </section>
                <section id="section-3" data-index="3" className="w-full min-h-[100dvh] relative section-observer">
                  <About />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none z-50" />
                </section>
                <section id="section-4" data-index="4" className="w-full min-h-[100dvh] relative section-observer">
                  <Calculator />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none z-50" />
                </section>
                <section id="section-5" data-index="5" className="w-full min-h-[100dvh] relative section-observer">
                  <HowWeWork />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none z-50" />
                </section>
                <section id="section-6" data-index="6" className="w-full min-h-[100dvh] relative section-observer">
                  <Journal />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none z-50" />
                </section>
                <section id="section-7" data-index="7" className="w-full min-h-[100dvh] relative section-observer">
                  <Contact isActive={navPage === 7} />
                </section>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}
