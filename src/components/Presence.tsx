import React from "react";
import { SiUpwork, SiFiverr } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";

interface PlatformCardProps {
  name: string;
  subtitle: string;
  url: string;
  icon: React.ReactNode;
}

const platforms: PlatformCardProps[] = [
  {
    name: "Upwork",
    subtitle: "Top Rated Freelancer",
    url: "https://www.upwork.com",
    icon: <SiUpwork className="w-6 h-6 text-[#14a800]" />,
  },
  {
    name: "Fiverr",
    subtitle: "Level 2 Seller",
    url: "https://www.fiverr.com",
    icon: (
      <div className="w-8 h-8 rounded-full bg-[#1dbf73] flex items-center justify-center">
        <SiFiverr className="w-5 h-5 text-white" />
      </div>
    ),
  },
  {
    name: "LinkedIn",
    subtitle: "Professional Profile",
    url: "https://www.linkedin.com/in/xtark-tech-0447a7430",
    icon: (
      <div className="w-8 h-8 rounded-md bg-[#0a66c2] flex items-center justify-center">
        <FaLinkedin className="w-5 h-5 text-white" />
      </div>
    ),
  },
];

export default function Presence() {
  return (
    <div className="w-full bg-[#030303] py-20 md:py-28 border-t border-white/5 relative z-10">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 flex flex-col items-center text-center">
        
        {/* Section Tag */}
        <span className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-[0.3em] font-semibold mb-2">
          Our Presence
        </span>
        
        {/* Purple Accent Line */}
        <div className="w-8 h-[2px] bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-full mb-8" />

        {/* Title */}
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white max-w-2xl leading-tight mb-4">
          You can find <span className="font-sans">XTARK</span> on <br className="md:hidden" />
          trusted <span className="text-zinc-500">platforms.</span>
        </h2>

        {/* Subtitle */}
        <p className="text-sm md:text-base text-zinc-500 max-w-md mb-12 font-sans font-light leading-relaxed">
          Real profiles. Real reviews. Real results.
        </p>

        {/* Cards Container */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-center gap-4 md:gap-0 w-full max-w-4.5xl mb-12">
          {platforms.map((platform, idx) => (
            <React.Fragment key={platform.name}>
              {idx > 0 && (
                <div className="hidden md:block w-[1px] h-10 bg-white/10 flex-shrink-0" />
              )}
              <a
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-5 rounded-2xl bg-zinc-950/40 border border-white/10 md:bg-transparent md:border-none hover:bg-zinc-905/40 md:hover:bg-transparent transition-all duration-300 text-left cursor-pointer flex-1 md:px-8 xl:px-12"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-900/50 flex items-center justify-center border border-white/5 flex-shrink-0">
                    {platform.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white group-hover:text-purple-400 transition-colors duration-300">
                      {platform.name}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {platform.subtitle}
                    </p>
                  </div>
                </div>

                {/* Arrow Button */}
                <div className="w-8 h-8 rounded-full border border-white/10 bg-zinc-900/30 flex items-center justify-center text-white transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:border-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 7h10v10" />
                    <path d="M7 17 17 7" />
                  </svg>
                </div>
              </a>
            </React.Fragment>
          ))}
        </div>

        {/* Divider line */}
        <div className="w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        {/* Verification Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-zinc-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-purple-400/80 flex-shrink-0"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 11 2 2 4-4" />
          </svg>
          <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-sans font-medium text-center leading-relaxed">
            Genuine profiles. <br className="sm:hidden" /> Verified presence.
          </span>
        </div>

      </div>
    </div>
  );
}
