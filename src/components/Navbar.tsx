import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";

interface NavbarProps {
  activePage: number;
  goToPage: (index: number) => void;
}

export default function Navbar({ activePage, goToPage }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const menuPathRef = useRef<SVGPathElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const path = menuPathRef.current;
    if (!path) return;

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const tl = gsap.timeline();
    timelineRef.current = tl;

    const isMobile = window.innerWidth < 768;

    if (menuOpen) {
      const targetCurve = isMobile 
        ? "M 15 0 C 30 25, 5 75, 15 100 L 100 100 L 100 0 Z" 
        : "M 40 0 C 55 25, 30 75, 40 100 L 100 100 L 100 0 Z";
      const sweepCurve = isMobile
        ? "M -5 0 C 15 25, -20 75, -5 100 L 100 100 L 100 0 Z"
        : "M 30 0 C 45 25, 20 75, 30 100 L 100 100 L 100 0 Z";

      // Opening wave animation
      gsap.set(path, { attr: { d: "M 100 0 C 100 25, 100 75, 100 100 L 100 100 L 100 0 Z" } });
      tl.to(path, {
        attr: { d: sweepCurve },
        duration: 0.5,
        ease: "power2.inOut"
      })
      .to(path, {
        attr: { d: targetCurve },
        duration: 0.4,
        ease: "power2.out"
      });
    } else {
      const closingSweep = isMobile
        ? "M 30 0 C 45 25, 20 75, 30 100 L 100 100 L 100 0 Z"
        : "M 70 0 C 85 25, 60 75, 70 100 L 100 100 L 100 0 Z";

      // Closing wave animation
      tl.to(path, {
        attr: { d: closingSweep },
        duration: 0.35,
        ease: "power2.in"
      })
      .to(path, {
        attr: { d: "M 100 0 C 100 25, 100 75, 100 100 L 100 100 L 100 0 Z" },
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, [menuOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setMenuOpen(false);
    }
  };

  const getDaysUntilMonday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
    if (dayOfWeek === 1) return "It's Monday!";
    const daysLeft = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    return `${daysLeft} day${daysLeft > 1 ? 's' : ''} until Monday`;
  };

  const navLinks = [
    { label: "Home", index: 0 },
    { label: "Explorations", index: 1 },
    { label: "Work", index: 2 },
    { label: "Resume", index: 3 },
    { label: "Journal", index: 4 },
  ];

  const handleLinkClick = (index: number) => {
    goToPage(index);
    setMenuOpen(false);
  };

  return (
    <>
      {/* Top Left Logo */}
      <div
        onClick={() => handleLinkClick(0)}
        className="fixed top-6 left-6 md:top-8 md:left-8 z-[150] flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-300"
      >
        <img src="/2.png" alt="Logo Icon" className="h-6 md:h-7 object-contain filter drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]" />
        <img src="/1.png" alt="Logo Text" className="h-5 md:h-6 object-contain filter drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]" />
      </div>

      {/* Top Right Widget (Time/Location) - Hidden on mobile to prevent overlapping */}
      <div className="hidden md:flex fixed top-8 right-[95px] z-[150] items-center gap-4 text-white">
        <div className="flex items-center gap-2 font-sans text-[12px] uppercase tracking-[0.1em] font-medium select-none drop-shadow-md">
          <span className="flex items-center gap-1.5">
            <span>MUMBAI</span>
            <span className="w-1 h-1 bg-white/50 rounded-full"></span>
            <span>{time}</span>
          </span>
        </div>
      </div>

      {/* Right Curved Sidebar (Hello Monday) */}
      <div className="curved-sidebar-container">
        {/* Background SVG for the sleek curve (starts at 0 width at top/bottom, bulges in middle) */}
        <svg
          className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 100 1000"
          preserveAspectRatio="none"
        >
          <path
            d="M 100 0 C 100 150, 0 350, 0 500 C 0 650, 100 850, 100 1000 Z"
            fill={menuOpen ? "#0a0a0a" : "#ffffff"}
            className="transition-colors duration-300"
          />
        </svg>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="relative z-10 flex flex-col items-center justify-center gap-1.5 w-8 h-8 md:hover:scale-110 transition-transform duration-300 cursor-pointer border-none bg-transparent"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            /* Custom Cross Lines (Black on White background for both mobile and desktop) */
            <div className="relative w-5 h-5 flex items-center justify-center">
              <span className="absolute w-4 h-[1.5px] bg-black rotate-45 rounded-full transition-all duration-300" />
              <span className="absolute w-4 h-[1.5px] bg-black -rotate-45 rounded-full transition-all duration-300" />
            </div>
          ) : (
            /* Custom Hamburger Lines (White on mobile when closed, Black on desktop) */
            <>
              <span className="w-5 h-[1.5px] bg-white md:bg-black transition-all duration-300 rounded-full" />
              <span className="w-5 h-[1.5px] bg-white md:bg-black transition-all duration-300 rounded-full" />
              <span className="w-5 h-[1.5px] bg-white md:bg-black transition-all duration-300 rounded-full" />
            </>
          )}
        </button>
      </div>

      {/* Fullscreen Slide-out Menu Overlay */}
      <div
        onClick={handleOverlayClick}
        className={`menu-overlay ${menuOpen ? "open" : ""}`}
      >
        {/* Background SVG wave overlay */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            ref={menuPathRef}
            fill="#ffffff"
            d="M 100 0 C 100 25, 100 75, 100 100 L 100 100 L 100 0 Z"
          />
        </svg>

        {/* Menu Navigation Links */}
        <div className="flex flex-col gap-2 md:gap-2.5 items-center text-center select-none relative z-10 w-[80%] md:w-[55%] ml-auto pr-0 md:pr-[8%]">
          {navLinks.map((link, idx) => (
            <button
              key={link.index}
              onClick={() => handleLinkClick(link.index)}
              style={{ transitionDelay: menuOpen ? `${0.4 + idx * 0.08}s` : '0s' }}
              className="menu-link-item group flex items-baseline gap-4 cursor-pointer text-left bg-transparent border-none outline-none"
            >
              <span
                className={`font-display text-[26px] md:text-[32px] lg:text-[40px] transition-all duration-350 ${activePage === link.index
                    ? "text-black translate-y-[-2px] font-medium"
                    : "text-zinc-400 hover:text-black hover:translate-y-[-4px] font-normal"
                  }`}
              >
                {link.label}
              </span>
            </button>
          ))}

          {/* Say Hi Menu Item */}
          <button
            onClick={() => handleLinkClick(5)}
            style={{ transitionDelay: menuOpen ? `${0.4 + navLinks.length * 0.08}s` : '0s' }}
            className="menu-link-item group flex items-baseline gap-4 cursor-pointer text-left bg-transparent border-none outline-none"
          >
            <span
              className={`font-display text-[26px] md:text-[32px] lg:text-[40px] transition-all duration-350 ${activePage === 5
                  ? "text-black translate-y-[-2px] font-medium"
                  : "text-zinc-400 hover:text-black hover:translate-y-[-4px] font-normal"
                }`}
            >
              Say hi ↗
            </span>
          </button>
        </div>

        {/* Bottom Social Links */}
        <div className="flex items-center gap-7 mt-12 relative z-10 w-[80%] md:w-[55%] ml-auto justify-center pr-0 md:pr-[8%]">
          {[
            {
              icon: (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="#1DA1F2">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              ),
              url: "https://twitter.com",
              label: "Twitter"
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="#0A66C2">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              ),
              url: "https://linkedin.com",
              label: "LinkedIn"
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="#EA4C89">
                  <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.37c-.36-.08-2.61-.53-5.27-.24.96 2.51 1.34 4.63 1.42 5.12 2.26-1.39 3.51-3.4 3.85-4.88zm-5.07 5.79c-.08-.43-.46-2.45-1.38-4.94-2.68.8-5.36.78-5.61.78-.05.57-.18 2.37-.09 4.3 2.68.89 5.37.15 7.08-.14zm-8.23-3.64c.2-.01 2.54.02 5.09-.72-.61-1.46-1.3-2.91-2.02-4.32-2.78.83-4.57 2.66-4.99 3.12.56.9 1.25 1.62 1.92 1.92zm-2.43-3.37c.39-.42 2.01-2.09 4.67-2.88-.36-.78-.75-1.56-1.16-2.32-3.17.98-4.49 3.23-4.71 3.65.23.57.64 1.09 1.2 1.55zm5.17-6.03c.38.7 0.74 1.41 1.07 2.11 2.27-.67 4.2-.18 4.79-.01-.76-2.2-2.64-3.8-4.94-4.22-.19.34-.58 1.28-.92 2.12zm6.27 2.91c-.51-.15-2.22-.58-4.27.08.66 1.31 1.3 2.66 1.86 3.99 2.26-.2 4.14.18 4.54.27-.14-1.74-.75-3.23-1.13-4.34z" />
                </svg>
              ),
              url: "https://dribbble.com",
              label: "Dribbble"
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="#181717">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              ),
              url: "https://github.com",
              label: "GitHub"
            },
          ].map((social, idx) => (
            <a
              key={social.label}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              style={{ transitionDelay: menuOpen ? `${0.4 + (navLinks.length + 1) * 0.08 + idx * 0.08}s` : '0s' }}
              className="menu-link-item opacity-80 hover:opacity-100 hover:scale-115 transition-all duration-300 flex items-center justify-center p-1.5"
              aria-label={social.label}
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Mobile Time Widget in Menu */}
        <div className="md:hidden flex items-center justify-center gap-1.5 mt-8 relative z-10 w-[80%] ml-auto pr-0 text-zinc-500 font-sans text-[11px] uppercase tracking-[0.1em] font-medium select-none">
          <span>MUMBAI</span>
          <span className="w-1 h-1 bg-zinc-300 rounded-full"></span>
          <span>{time}</span>
        </div>
      </div>
    </>
  );
}
