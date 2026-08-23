import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import gsap from "gsap";

const roles = ["Websites", "Experiences", "Branding", "Products"];

interface HomeProps {
  goToPage: (index: number) => void;
  isActive: boolean;
}

export default function Home({ goToPage, isActive }: HomeProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const streamUrl = "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";

    let hls: Hls | null = null;
    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, []);

  // Play/Pause HLS video stream based on page visibility state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.play().catch(() => { });
    } else {
      video.pause();
    }
  }, [isActive]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isActive) return;
    const tl = gsap.timeline();
    tl.fromTo(
      ".center-graphic",
      { opacity: 0, scale: 0.9, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.1 }
    );
    tl.fromTo(
      ".blur-in",
      { opacity: 0, filter: "blur(10px)", y: 20 },
      { opacity: 1, filter: "blur(0px)", y: 0, duration: 1, ease: "power3.out" },
      "-=0.9"
    );
  }, [isActive]);

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-bg select-none">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        {/* Cosmic starfield loop */}
        <video
          ref={videoRef}
          className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent" />
        {/* Side Text Elements (Desktop Only) */}
        <div className="absolute left-[4%] xl:left-[6%] top-1/2 -translate-y-1/2 hidden lg:flex flex-col max-w-[180px] gap-3 z-20 blur-in text-left">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Digital Agency</span>
          <p className="text-[13px] text-zinc-300 leading-relaxed font-sans font-light">
            We craft premium digital experiences and elevate brands through strategy and design.
          </p>
        </div>

        <div className="absolute right-[6%] xl:right-[8%] top-0 bottom-0 my-auto h-fit hidden lg:flex flex-row items-center gap-3 z-20 blur-in">
          <div className="w-[1px] h-12 bg-zinc-600"></div>
          <span className="text-[10px] text-zinc-400 uppercase tracking-[0.3em] font-sans" style={{ writingMode: 'vertical-rl' }}>Scroll to explore</span>
        </div>

        {/* Hello Monday Character Blended Layer (positioned upward and cropped to remove borders) */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-[0vh] w-full max-w-[940px] h-[68vh] flex items-center justify-center bg-transparent pointer-events-none"
          style={{
            mixBlendMode: "screen",
            clipPath: "inset(0 6px 0 6px)"
          }}
        >
          <video
            src="/hm-hero-mobile.mp4"
            className="h-full w-auto filter invert opacity-85"
            style={{ clipPath: "inset(0 8px 0 8px)" }}
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      </div>

      {/* Hero Content (Hello Monday Foreground Text overlays - positioned below the character) */}
      <div className="relative z-10 max-w-[860px] w-full flex flex-col items-center text-center px-6 pt-[71vh]">

        {/* Small Subtitle */}
        <div className="blur-in text-[13px] md:text-[14px] text-text-primary/80 tracking-normal mb-3 font-sans font-light">
          We build digital (and premium)...
        </div>

        {/* Giant Changing Word (Serif Font) */}
        <div className="blur-in mb-0.5 flex items-center justify-center">
          <span
            key={roleIndex}
            className="font-display text-5xl md:text-7xl lg:text-8xl text-text-primary animate-role-fade-in block font-light leading-none tracking-normal"
          >
            {roles[roleIndex]}
          </span>
        </div>

        {/* Scroll Indicator (Only the dynamic dot falling down, positioned inside relative flow with mt-0 margin gap!) */}
        <div
          onClick={() => goToPage(1)}
          className="flex flex-col items-center cursor-pointer group mt-0"
        >
          <div className="w-2 h-14 bg-transparent relative overflow-hidden flex justify-center">
            <div key={roleIndex} className="w-[5px] h-[5px] bg-white rounded-full animate-dot-fall" />
          </div>
        </div>

      </div>
    </div>
  );
}
