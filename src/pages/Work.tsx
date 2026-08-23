import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);
CustomEase.create("stackEase", "0.83, 0, 0.17, 1");

const projects = [
  { title: "Fabric", subtitle: "Creative Agency / 2026", image: "/fabric.png" },
  { title: "Gym", subtitle: "Fitness App / 2026", image: "/gym.png" },
  { title: "Compass", subtitle: "Navigation System / 2026", image: "/compass.png" },
  { title: "Shop", subtitle: "E-Commerce / 2026", image: "/f.shop.png" },
  { title: "Klians", subtitle: "Brand Identity / 2026", image: "/klians.png" },
  { title: "SmartQ", subtitle: "SaaS Platform / 2026", image: "/smartq.png" },
];

export default function Work({ isActive }: { isActive?: boolean }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    // Reset active index when entering page
    if (isActive) {
      activeIndexRef.current = 0;
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive || !sliderRef.current) return;

    // Mobile Optimization: Entirely disable GSAP stacking logic on mobile screens
    if (window.innerWidth < 640) {
      return;
    }

    const splitText = (selector: string) => {
      const elements = sliderRef.current?.querySelectorAll(selector);
      if (!elements) return;
      const isMobile = window.innerWidth < 640;

      elements.forEach((element) => {
        if (element.querySelector("span")) return;
        const text = (element as HTMLElement).innerText;

        // Performance optimization: Avoid animating 30+ separate DOM nodes per card on mobile
        if (isMobile) {
          element.innerHTML = `<span>${text}</span>`;
          return;
        }

        const chars = text
          .split("")
          .map((char) => `<span>${char === " " ? "&nbsp;" : char}</span>`)
          .join("");
        element.innerHTML = chars;
      });
    };

    const positionCards = () => {
      if (!sliderRef.current) return;
      const offset = window.innerWidth < 640 ? 12 : 18;
      const cards = Array.from(sliderRef.current.querySelectorAll(".card"));
      gsap.to(cards, {
        y: (index) => `${-offset + offset * index}%`,
        z: (index) => offset * index,
        duration: 0.65, // Speed up stack transition from 1s to 0.65s
        ease: "stackEase",
        stagger: -0.08,
      });
    };

    const prepareCardText = () => {
      if (!sliderRef.current) return;
      gsap.set(".slider .card .copy h1 span", { y: -220 });
      gsap.set(".slider .card .copy p span", { y: 60, opacity: 0 });
      gsap.set(".slider .card:last-child .copy h1 span", { y: 0 });
      gsap.set(".slider .card:last-child .copy p span", { y: 0, opacity: 1 });
    };

    // Initialize layout and typography
    splitText(".copy h1");
    splitText(".copy p");
    positionCards();
    prepareCardText();

    let scrollTimeout: ReturnType<typeof setTimeout>;

    const handleNextSlide = () => {
      if (isAnimatingRef.current || !sliderRef.current) return;
      isAnimatingRef.current = true;

      const slider = sliderRef.current;
      const cards = Array.from(slider.querySelectorAll(".card"));
      const lastCard = cards.pop();
      const upcomingCard = cards[cards.length - 1];

      if (!lastCard || !upcomingCard) {
        isAnimatingRef.current = false;
        return;
      }

      const currentTitleChars = lastCard.querySelectorAll(".copy h1 span");
      const currentMetaChars = lastCard.querySelectorAll(".copy p span");
      const nextTitleChars = upcomingCard.querySelectorAll(".copy h1 span");
      const nextMetaChars = upcomingCard.querySelectorAll(".copy p span");

      gsap.to(currentTitleChars, {
        y: 220,
        duration: 0.45, // Speed up text wipe out from 0.7s to 0.45s
        ease: "stackEase",
        stagger: 0.02,
      });

      gsap.to(currentMetaChars, {
        y: 40,
        opacity: 0,
        duration: 0.3, // Speed up meta wipe out from 0.45s to 0.3s
        ease: "power3.out",
        stagger: 0.01,
      });

      gsap.to(lastCard, {
        y: "+=160%",
        duration: 0.55, // Speed up card dropping from 0.78s to 0.55s
        ease: "stackEase",
        onComplete: () => {
          slider.prepend(lastCard);
          positionCards();

          gsap.set(lastCard.querySelectorAll(".copy h1 span"), { y: -220 });
          gsap.set(lastCard.querySelectorAll(".copy p span"), { y: 60, opacity: 0 });

          setTimeout(() => {
            isAnimatingRef.current = false;
          }, 250); // Speed up cool down from 420ms to 250ms
        },
      });

      gsap.to(nextTitleChars, {
        y: 0,
        duration: 0.6, // Speed up text wipe in from 0.9s to 0.6s
        ease: "stackEase",
        stagger: 0.025,
      });

      gsap.to(nextMetaChars, {
        y: 0,
        opacity: 1,
        duration: 0.38, // Speed up meta wipe in from 0.55s to 0.38s
        ease: "power3.out",
        stagger: 0.015,
        delay: 0.08,
      });
    };

    const handlePrevSlide = () => {
      if (isAnimatingRef.current || !sliderRef.current) return;
      isAnimatingRef.current = true;

      const slider = sliderRef.current;
      const cards = Array.from(slider.querySelectorAll(".card"));
      const firstCard = cards.shift(); // The card at the back of the DOM
      const currentCard = cards[cards.length - 1]; // The current visible card (soon to be back)

      if (!firstCard || !currentCard) {
        isAnimatingRef.current = false;
        return;
      }

      const currentTitleChars = currentCard.querySelectorAll(".copy h1 span");
      const currentMetaChars = currentCard.querySelectorAll(".copy p span");

      // Animate current visible text out (upwards)
      gsap.to(currentTitleChars, {
        y: -220,
        duration: 0.45, // Speed up text wipe out from 0.7s to 0.45s
        ease: "stackEase",
        stagger: 0.02,
      });

      gsap.to(currentMetaChars, {
        y: 60,
        opacity: 0,
        duration: 0.3, // Speed up meta wipe out from 0.45s to 0.3s
        ease: "power3.out",
        stagger: 0.01,
      });

      // Instantly append the back card to the end of the DOM (so it becomes the front card)
      slider.appendChild(firstCard);

      const offset = window.innerWidth < 640 ? 12 : 18;
      // Instantly position it off-screen at the bottom and in the front plane
      gsap.set(firstCard, {
        y: "160%",
        z: offset * (cards.length),
      });

      // Instantly hide its text below
      const nextTitleChars = firstCard.querySelectorAll(".copy h1 span");
      const nextMetaChars = firstCard.querySelectorAll(".copy p span");
      gsap.set(nextTitleChars, { y: 220 });
      gsap.set(nextMetaChars, { y: 40, opacity: 0 });

      // Animate the incoming card into stack position
      gsap.to(firstCard, {
        y: `${-offset + offset * (cards.length)}%`,
        duration: 0.55, // Speed up card entering from 0.78s to 0.55s
        ease: "stackEase",
        onComplete: () => {
          positionCards();
          setTimeout(() => {
            isAnimatingRef.current = false;
          }, 250); // Speed up cool down from 420ms to 250ms
        },
      });

      // Animate the new front card's text in
      gsap.to(nextTitleChars, {
        y: 0,
        duration: 0.6, // Speed up text wipe in from 0.9s to 0.6s
        ease: "stackEase",
        stagger: 0.025,
      });

      gsap.to(nextMetaChars, {
        y: 0,
        opacity: 1,
        duration: 0.38, // Speed up meta wipe in from 0.55s to 0.38s
        ease: "power3.out",
        stagger: 0.015,
        delay: 0.08,
      });
    };

    const handleScroll = (e: WheelEvent) => {
      const deltaY = e.deltaY;

      if (isAnimatingRef.current) {
        e.preventDefault();
        e.stopImmediatePropagation(); // Block other window listeners (like App.tsx)
        return;
      }

      if (deltaY > 0) {
        // Scroll Down (Next Project)
        if (activeIndexRef.current < projects.length - 1) {
          e.preventDefault();
          e.stopImmediatePropagation(); // Block other window listeners (like App.tsx)
          if (scrollTimeout) clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            handleNextSlide();
            activeIndexRef.current += 1;
          }, 30);
        }
      } else {
        // Scroll Up (Previous Project)
        if (activeIndexRef.current > 0) {
          e.preventDefault();
          e.stopImmediatePropagation(); // Block other window listeners (like App.tsx)
          if (scrollTimeout) clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            handlePrevSlide();
            activeIndexRef.current -= 1;
          }, 30);
        }
      }
    };

    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isAnimatingRef.current) {
        // Allow event to bubble if animating, so it doesn't get completely blocked,
        // but typically we stop it. To be safe, we just return if animating.
        return;
      }

      const deltaY = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) < 50) return; // Ignore accidental tiny swipes

      if (deltaY > 0) {
        // Swipe Up (Next Project)
        if (activeIndexRef.current < projects.length - 1) {
          e.stopImmediatePropagation(); // Block App.tsx from changing page
          if (scrollTimeout) clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            handleNextSlide();
            activeIndexRef.current += 1;
          }, 30);
        }
      } else {
        // Swipe Down (Previous Project)
        if (activeIndexRef.current > 0) {
          e.stopImmediatePropagation(); // Block App.tsx from changing page
          if (scrollTimeout) clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            handlePrevSlide();
            activeIndexRef.current -= 1;
          }, 30);
        }
      }
    };

    // Attach wheel listener to the entire window with passive: false to allow e.preventDefault()
    window.addEventListener("wheel", handleScroll, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: false }); // Needs to be non-passive if we want to prevent default, but stopPropagation works regardless.

    return () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isActive]);

  return (
    <div className="work-page-scope">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&display=swap');

        .work-page-scope {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: radial-gradient(circle at 50% 30%, rgba(255,255,255,0.06), transparent 35%), #0f0f10;
          font-family: "Inter", sans-serif;
          color: #f3eee7;
        }

        .work-page-scope img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .work-page-scope .container {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .work-page-scope .slider {
          position: absolute;
          top: 2vh; /* Moved higher up */
          width: 100vw;
          height: 100%;
          overflow: hidden;
          perspective: 300px;
          perspective-origin: 50% 50%;
        }

        .work-page-scope .card {
          position: absolute;
          top: 25%; /* Shifted higher up */
          left: 50%;
          width: min(50vw, 800px); /* Made slightly smaller */
          height: 380px; /* Made slightly smaller */
          border-radius: 18px;
          overflow: hidden;
          transform: translate3d(-50%, -50%, 0);
          background: #000;
          box-shadow: 0 26px 60px rgba(0, 0, 0, 0.32);
          will-change: transform;
        }

        .work-page-scope .card::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.85) 100%);
        }

        .work-page-scope .card img {
          position: absolute;
          inset: 0;
          opacity: 0.92;
        }

        .work-page-scope .copy {
          position: absolute;
          left: 50%;
          bottom: 34px;
          transform: translateX(-50%);
          width: calc(100% - 56px);
          z-index: 2;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
          color: #f4eee7;
          text-align: center;
        }

        .work-page-scope .copy h1 {
          position: relative;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(48px, 5.5vw, 84px); /* Slightly smaller text clamp */
          font-weight: 600;
          line-height: 0.9;
          letter-spacing: -0.04em;
          text-transform: uppercase;
        }

        .work-page-scope .copy p {
          position: relative;
          margin-top: 10px;
          font-size: 13px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          opacity: 0.86;
        }

        .work-page-scope .copy h1 span,
        .work-page-scope .copy p span {
          position: relative;
          display: inline-block;
        }

        @media (max-width: 900px) {
          .work-page-scope .card {
            width: min(68vw, 650px);
            height: 330px;
          }

          .work-page-scope .slider {
            top: 2vh;
          }
        }

        @media (max-width: 640px) {
          .work-page-scope .slider {
            top: 0;
          }

          .work-page-scope .card {
            width: calc(100vw - 36px);
            height: 340px;
            border-radius: 18px;
            top: 38%;
            box-shadow: 0 10px 24px rgba(0, 0, 0, 0.4);
          }

          .work-page-scope .copy {
            width: calc(100% - 32px);
            bottom: 24px;
          }

          .work-page-scope .copy h1 {
            font-size: 40px;
          }

          .work-page-scope .copy p {
            font-size: 11px;
            margin-top: 6px;
          }
        }
      `}</style>

      <div className="container hidden sm:block">
        <div ref={sliderRef} className="slider">
          {[...projects].reverse().map((project, idx) => (
            <article key={idx} className="card">
              <img src={project.image} alt={project.title} />
              <div className="copy">
                <h1>{project.title}</h1>
                <p>{project.subtitle}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Ultra-light Mobile View (Native CSS Horizontal Scroll) */}
      <div
        className="sm:hidden flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory h-full w-full items-center px-8 gap-5 hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {[...projects].map((project, idx) => (
          <article
            key={idx}
            className="flex-none w-[80vw] h-[58vh] rounded-[22px] overflow-hidden relative snap-center bg-black shadow-2xl"
          >
            <img src={project.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/90" />
            <div className="absolute bottom-8 left-0 right-0 text-center text-[#f4eee7] px-4">
              <h1 className="font-display text-[42px] uppercase font-semibold leading-[0.9] tracking-[-0.04em] mb-2">{project.title}</h1>
              <p className="text-[11px] uppercase tracking-[0.18em] opacity-80">{project.subtitle}</p>
            </div>
          </article>
        ))}
      </div>

      {/* Floating Action Hint */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 uppercase tracking-widest text-[10px] pointer-events-none z-20 hidden sm:block">
        Scroll to Browse
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 uppercase tracking-widest text-[10px] pointer-events-none z-20 sm:hidden flex items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse">
          <path d="M19 12H5M5 12l7-7M5 12l7 7" />
        </svg>
        Swipe to Browse
      </div>
    </div>
  );
}
