import React, { useEffect, useRef } from "react";
import Hls from "hls.js";
import gsap from "gsap";

interface ContactProps {
  isActive: boolean;
}

export default function Contact({ isActive }: ContactProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const marqueeRef = useRef<HTMLDivElement | null>(null);

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
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isActive]);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    gsap.to(marquee, {
      xPercent: -50,
      duration: 40,
      ease: "none",
      repeat: -1,
    });
  }, []);

  const singleMarqueeText = "BUILDING THE FUTURE • ";
  const marqueeText = Array(10).fill(singleMarqueeText).join("");

  return (
    <div className="relative w-full overflow-hidden bg-bg py-24 md:py-32 select-none min-h-screen flex items-center justify-center border-t border-stroke">
      
      {/* Background Video (Flipped Vertically) */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 scale-y-[-1] opacity-35"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 flex flex-col justify-between min-h-[50vh] gap-16 w-full">
        
        {/* CTA Container */}
        <div className="flex flex-col items-center text-center">
          <span className="text-xs text-muted uppercase tracking-[0.3em] font-medium mb-6">
            Get in Touch
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight text-text-primary mb-10 max-w-xl leading-tight">
            Let's build the <span className="font-display italic">future</span> together.
          </h2>
          
          <a
            href="mailto:hello@michaelsmith.com"
            className="group relative inline-flex items-center justify-center rounded-full text-sm font-semibold px-8 py-4 bg-text-primary text-bg hover:scale-105 transition-all duration-300 overflow-hidden cursor-pointer shadow-lg shadow-black/20"
          >
            <span className="absolute inset-0 rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 p-[1.5px]" style={{ margin: "-1px" }}>
              <span className="w-full h-full block rounded-full bg-bg" />
            </span>
            <span className="group-hover:text-text-primary transition-colors duration-300 relative z-10">hello@michaelsmith.com</span>
          </a>
        </div>

        {/* GSAP Marquee */}
        <div className="w-full overflow-hidden border-y border-stroke py-6 my-4 flex">
          <div
            ref={marqueeRef}
            className="flex whitespace-nowrap font-display italic text-5xl md:text-7xl text-white/5 tracking-wider select-none"
          >
            <span className="pr-4">{marqueeText}</span>
            <span className="pr-4">{marqueeText}</span>
          </div>
        </div>

        {/* Bottom Social list */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-stroke/40 pt-8">
          <div className="flex items-center gap-6">
            {[
              { label: "Twitter", url: "https://twitter.com" },
              { label: "LinkedIn", url: "https://linkedin.com" },
              { label: "Dribbble", url: "https://dribbble.com" },
              { label: "GitHub", url: "https://github.com" },
            ].map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs uppercase tracking-widest text-muted hover:text-text-primary transition-colors duration-250 font-medium"
              >
                {social.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3 bg-surface/40 border border-stroke rounded-full px-4 py-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-muted font-bold">
              Available for projects
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
