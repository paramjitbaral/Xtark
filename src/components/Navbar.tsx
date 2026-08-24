import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { SiInstagram, SiWhatsapp, SiDiscord, SiGmail } from "react-icons/si";

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
      if (isMobile) {
        // Fast GPU-accelerated slide for mobile
        gsap.set(path, { attr: { d: "M 15 0 C 30 25, 5 75, 15 100 L 100 100 L 100 0 Z" } });
        gsap.fromTo(path.parentElement, { x: "100%" }, { x: "0%", duration: 0.5, ease: "power3.out" });
      } else {
        const targetCurve = "M 40 0 C 55 25, 30 75, 40 100 L 100 100 L 100 0 Z";
        const sweepCurve = "M 30 0 C 45 25, 20 75, 30 100 L 100 100 L 100 0 Z";

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
      }
    } else {
      if (isMobile) {
        // Fast slide out for mobile
        tl.to(path.parentElement, { x: "100%", duration: 0.4, ease: "power3.in" });
      } else {
        const closingSweep = "M 70 0 C 85 25, 60 75, 70 100 L 100 100 L 100 0 Z";

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
        className="fixed top-6 left-6 md:top-8 md:left-8 z-[150] flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-300 mix-blend-difference text-white"
      >
        <img 
          src="/2.png" 
          alt="Logo Icon" 
          className="h-6 md:h-7 object-contain" 
        />
        <img 
          src="/1.png" 
          alt="Logo Text" 
          className="h-5 md:h-6 object-contain" 
        />
      </div>

      {/* Top Right Widget (Time/Location) - Hidden on mobile to prevent overlapping */}
      <div className="hidden md:flex fixed top-8 right-[95px] z-[150] items-center gap-4 text-white mix-blend-difference">
        <div className="flex items-center gap-2 font-sans text-[12px] uppercase tracking-[0.1em] font-medium select-none">
          <span className="flex items-center gap-1.5">
            <span>MUMBAI</span>
            <span className="w-1 h-1 rounded-full bg-white/50"></span>
            <span>{time}</span>
          </span>
        </div>
      </div>

      {/* Right Curved Sidebar (Hello Monday) */}
      <div className="curved-sidebar-container mix-blend-difference md:mix-blend-normal">
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
            /* Custom Cross Lines (Black on mobile, White on desktop) */
            <div className="relative w-5 h-5 flex items-center justify-center">
              <span className="absolute w-4 h-[1.5px] bg-black md:bg-white rotate-45 rounded-full transition-all duration-300" />
              <span className="absolute w-4 h-[1.5px] bg-black md:bg-white -rotate-45 rounded-full transition-all duration-300" />
            </div>
          ) : (
            /* Custom Hamburger Lines (Auto-invert via mix-blend-difference on mobile, solid black on desktop) */
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
              icon: <SiDiscord size={22} color="#5865F2" />,
              url: "https://discord.gg/Fv7f2vmD7",
              label: "Discord"
            },
            {
              icon: <SiWhatsapp size={22} color="#25D366" />,
              url: "https://wa.me/",
              label: "WhatsApp"
            },
            {
              icon: <SiInstagram size={22} color="#E1306C" />,
              url: "https://www.instagram.com/xtark.tech",
              label: "Instagram"
            },
            {
              icon: <SiGmail size={22} color="#EA4335" />,
              url: "mailto:xtark.tech@gmail.com",
              label: "Gmail"
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
