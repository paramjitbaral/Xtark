import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { AnimatePresence } from "framer-motion";
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
  const [activePage, setActivePage] = useState(0);
  
  const isTransitioningRef = useRef(false);
  const scrollCooldownRef = useRef(false);

  // SVG Refs
  const svgOverlayRef = useRef<SVGSVGElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);

  const goToPage = (index: number) => {
    if (index === activePage || isTransitioningRef.current) return;
    triggerTransition(activePage, index);
  };

  const triggerTransition = (from: number, to: number) => {
    if (to < 0 || to > 7 || from === to) return;

    isTransitioningRef.current = true;

    const fromEl = document.getElementById(`page-wrapper-${from}`);
    const toEl = document.getElementById(`page-wrapper-${to}`);
    const svgOverlay = svgOverlayRef.current;
    const path = pathRef.current;

    if (!fromEl || !toEl) {
      setActivePage(to);
      isTransitioningRef.current = false;
      return;
    }

    gsap.killTweensOf([fromEl, toEl]);
    if (path) gsap.killTweensOf(path);

    // Instantly scroll destination to top
    const toContainer = document.getElementById(`page-container-${to}`);
    if (toContainer) {
      toContainer.scrollTop = 0;
    }

    const swapPages = () => {
      gsap.set(fromEl, { display: "none" });
      gsap.set(toEl, { zIndex: 10 });
    };

    const tl = gsap.timeline({
      onComplete: () => {
        // Reset properties and hide the outgoing page
        gsap.set(fromEl, { display: "none", clearProps: "scale,opacity,clipPath,transform,transformOrigin" });
        gsap.set(toEl, { clearProps: "zIndex,transformOrigin" });
        if (path) gsap.set(path, { attr: { d: "M 0 100 V 100 Q 50 100 100 100 V 100 z" } });
        if (svgOverlay) gsap.set(svgOverlay, { visibility: "hidden", pointerEvents: "none" });
        
        setActivePage(to);
        isTransitioningRef.current = false;
      }
    });

    const isForward = to > from;
    const transitionType = Math.min(from, to);

    // Swap between 5 unique transition types based on target route limits
    if (transitionType === 0) {
      // ==========================================
      // 1. SKEWED EDITORIAL CARD SLIDE (Home <-> Work)
      // ==========================================
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

    } else if (transitionType === 1 && svgOverlay && path) {
      // ==========================================
      // 2. LIQUID CURVED WAVE (Work <-> About)
      // ==========================================
      gsap.set(svgOverlay, { visibility: "visible", pointerEvents: "auto" });
      gsap.set(toEl, { display: "block", zIndex: 1 });
      gsap.set(fromEl, { zIndex: 5 });

      if (isForward) {
        gsap.set(path, { attr: { d: "M 0 100 V 100 Q 50 100 100 100 V 100 z" } });
        tl.to(path, { attr: { d: "M 0 100 V 50 Q 50 0 100 50 V 100 z" }, duration: 0.35, ease: "sine.in" })
          .to(path, { attr: { d: "M 0 100 V 0 Q 50 0 100 0 V 100 z" }, duration: 0.25, ease: "sine.out", onComplete: () => {
            swapPages();
            gsap.set(path, { attr: { d: "M 0 0 V 100 Q 50 100 100 100 V 0 z" } });
          } })
          .to(path, { attr: { d: "M 0 0 V 50 Q 50 100 100 50 V 0 z" }, duration: 0.35, ease: "sine.in", delay: 0.05 })
          .to(path, { attr: { d: "M 0 0 V 0 Q 50 0 100 0 V 0 z" }, duration: 0.25, ease: "sine.out" });
      } else {
        gsap.set(path, { attr: { d: "M 0 0 V 0 Q 50 0 100 0 V 0 z" } });
        tl.to(path, { attr: { d: "M 0 0 V 50 Q 50 100 100 50 V 0 z" }, duration: 0.35, ease: "sine.in" })
          .to(path, { attr: { d: "M 0 0 V 100 Q 50 100 100 100 V 0 z" }, duration: 0.25, ease: "sine.out", onComplete: () => {
            swapPages();
            gsap.set(path, { attr: { d: "M 0 100 V 0 Q 50 0 100 0 V 100 z" } });
          } })
          .to(path, { attr: { d: "M 0 100 V 50 Q 50 0 100 50 V 100 z" }, duration: 0.35, ease: "sine.in", delay: 0.05 })
          .to(path, { attr: { d: "M 0 100 V 100 Q 50 100 100 100 V 100 z" }, duration: 0.25, ease: "sine.out" });
      }

    } else if (transitionType === 2) {
      // ==========================================
      // 3. CURVED IRIS WIPE (About <-> Journal)
      // ==========================================
      if (isForward) {
        gsap.set(toEl, { display: "block", zIndex: 10, clipPath: "circle(0% at 50% 50%)" });
        gsap.set(fromEl, { zIndex: 5 });

        tl.to(toEl, { clipPath: "circle(150% at 50% 50%)", duration: 0.8, ease: "power2.inOut" });
      } else {
        gsap.set(toEl, { display: "block", zIndex: 5 });
        gsap.set(fromEl, { zIndex: 10, clipPath: "circle(150% at 50% 50%)" });

        tl.to(fromEl, { clipPath: "circle(0% at 50% 50%)", duration: 0.8, ease: "power2.inOut" });
      }

    } else if (transitionType === 3) {
      // ==========================================
      // 4. BI-DIRECTIONAL EDITORIAL SLIDE (Journal <-> Explorations)
      // ==========================================
      if (isForward) {
        gsap.set(toEl, { display: "block", zIndex: 10, xPercent: 100 });
        gsap.set(fromEl, { zIndex: 5 });

        tl.to(fromEl, { xPercent: -30, duration: 0.7, ease: "power3.inOut" })
          .to(toEl, { xPercent: 0, duration: 0.7, ease: "power3.inOut" }, "<");
      } else {
        gsap.set(toEl, { display: "block", zIndex: 5, xPercent: -30 });
        gsap.set(fromEl, { zIndex: 10, xPercent: 0 });

        tl.to(fromEl, { xPercent: 100, duration: 0.7, ease: "power3.inOut" })
          .to(toEl, { xPercent: 0, duration: 0.7, ease: "power3.inOut" }, "<");
      }

    } else if (transitionType === 4) {
      // ==========================================
      // 5. CURVED CORNER WIPE (Calculator <-> HowWeWork)
      // ==========================================
      if (isForward) {
        gsap.set(toEl, { display: "block", zIndex: 10, clipPath: "polygon(100% 100%, 100% 100%, 100% 100%)" });
        gsap.set(fromEl, { zIndex: 5 });

        tl.to(toEl, { clipPath: "polygon(-30% 130%, 130% -30%, 130% 130%)", duration: 1.0, ease: "power2.in" })
          .to(toEl, { clipPath: "polygon(-30% -30%, 130% -30%, 130% 130%, -30% 130%)", duration: 0.8, ease: "power2.out" });
      } else {
        gsap.set(toEl, { display: "block", zIndex: 5 });
        gsap.set(fromEl, { zIndex: 10, clipPath: "polygon(-30% -30%, 130% -30%, 130% 130%, -30% 130%)" });

        tl.to(fromEl, { clipPath: "polygon(-30% 130%, 130% -30%, 130% 130%)", duration: 0.8, ease: "power2.in" })
          .to(fromEl, { clipPath: "polygon(100% 100%, 100% 100%, 100% 100%)", duration: 1.0, ease: "power2.out" });
      }

    } else {
      // ==========================================
      // 6. SCALE FADE (HowWeWork <-> Journal / fallback)
      // ==========================================
      if (isForward) {
        gsap.set(toEl, { display: "block", zIndex: 10, opacity: 0, scale: 0.95 });
        gsap.set(fromEl, { zIndex: 5 });

        tl.to(fromEl, { opacity: 0, scale: 1.05, duration: 0.5, ease: "power2.inOut" })
          .to(toEl, { opacity: 1, scale: 1, duration: 0.5, ease: "power2.inOut" }, "<0.15");
      } else {
        gsap.set(toEl, { display: "block", zIndex: 5, opacity: 0, scale: 1.05 });
        gsap.set(fromEl, { zIndex: 10, opacity: 1, scale: 1 });

        tl.to(fromEl, { opacity: 0, scale: 0.95, duration: 0.5, ease: "power2.inOut" })
          .to(toEl, { opacity: 1, scale: 1, duration: 0.5, ease: "power2.inOut" }, "<0.15");
      }
    }
  };

  useEffect(() => {
    if (isLoading) return;

    const handleWheel = (e: WheelEvent) => {
      if (isTransitioningRef.current || scrollCooldownRef.current) return;

      const currentContainer = document.getElementById(`page-container-${activePage}`);
      if (!currentContainer) return;

      const deltaY = e.deltaY;

      if (deltaY > 0) {
        // Scroll Down
        const isAtBottom = currentContainer.scrollTop + currentContainer.clientHeight >= currentContainer.scrollHeight - 2;
        if (isAtBottom && activePage < 7) {
          e.preventDefault();
          scrollCooldownRef.current = true;
          triggerTransition(activePage, activePage + 1);
          setTimeout(() => {
            scrollCooldownRef.current = false;
          }, 1100);
        }
      } else {
        // Scroll Up
        const isAtTop = currentContainer.scrollTop <= 1;
        if (isAtTop && activePage > 0) {
          e.preventDefault();
          scrollCooldownRef.current = true;
          triggerTransition(activePage, activePage - 1);
          setTimeout(() => {
            scrollCooldownRef.current = false;
          }, 1100);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [isLoading, activePage]);

  // Touch swipes support
  useEffect(() => {
    if (isLoading) return;

    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isTransitioningRef.current || scrollCooldownRef.current) return;

      const currentContainer = document.getElementById(`page-container-${activePage}`);
      if (!currentContainer) return;

      const deltaY = touchStartY - e.changedTouches[0].clientY;

      // Require a minimum swipe distance to prevent accidental transitions
      if (Math.abs(deltaY) < 50) return;

      if (deltaY > 0) {
        // Swipe Up -> Scroll Down
        const isAtBottom = currentContainer.scrollTop + currentContainer.clientHeight >= currentContainer.scrollHeight - 2;
        if (isAtBottom && activePage < 7) {
          scrollCooldownRef.current = true;
          triggerTransition(activePage, activePage + 1);
          setTimeout(() => {
            scrollCooldownRef.current = false;
          }, 1100);
        }
      } else {
        // Swipe Down -> Scroll Up
        const isAtTop = currentContainer.scrollTop <= 1;
        if (isAtTop && activePage > 0) {
          scrollCooldownRef.current = true;
          triggerTransition(activePage, activePage - 1);
          setTimeout(() => {
            scrollCooldownRef.current = false;
          }, 1100);
        }
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isLoading, activePage]);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>
      
      <div className="relative bg-bg min-h-screen text-text-primary selection:bg-white selection:text-black overflow-hidden w-screen h-screen">
          <Navbar activePage={activePage} goToPage={goToPage} />
          
          {[
            { component: <Home goToPage={goToPage} isActive={activePage === 0} />, index: 0 },
            { component: <Explorations isActive={activePage === 1} />, index: 1 },
            { component: <Work isActive={activePage === 2} />, index: 2 },
            { component: <About />, index: 3 },
            { component: <Calculator />, index: 4 },
            { component: <HowWeWork />, index: 5 },
            { component: <Journal />, index: 6 },
            { component: <Contact isActive={activePage === 7} />, index: 7 },
          ].map((page) => (
            <div
              key={page.index}
              id={`page-wrapper-${page.index}`}
              className="fixed inset-0 w-full h-full"
              style={{
                zIndex: page.index === activePage ? 10 : 1,
                display: page.index === activePage ? "block" : "none",
              }}
            >
              <div
                id={`page-container-${page.index}`}
                className="w-full h-full overflow-y-auto overflow-x-hidden scroll-smooth overscroll-none"
              >
                {page.component}
              </div>
            </div>
          ))}

          {/* Snappy Liquid Wave Transition Canvas Overlay */}
          <svg
            ref={svgOverlayRef}
            className="fixed inset-0 w-full h-full pointer-events-none z-[50] invisible"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <path
              ref={pathRef}
              className="fill-[#080808]"
              d="M 0 100 V 100 Q 50 100 100 100 V 100 z"
            />
          </svg>
        </div>
    </>
  );
}
