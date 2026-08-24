import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Calculator() {
  const [serviceType, setServiceType] = useState<"design" | "development" | "both">("both");
  const [pages, setPages] = useState<number>(5);
  const [includeGrowthPack, setIncludeGrowthPack] = useState<boolean>(true);

  const calculatePrice = () => {
    let base = 3999;
    let perPage = 700;

    if (serviceType === "design") {
      base = 1999;
      perPage = 350;
    } else if (serviceType === "development") {
      base = 2999;
      perPage = 500;
    }

    let total = Math.max(base, base + (pages - 1) * perPage);

    if (includeGrowthPack) {
      total += pages * 350;
    }

    return total;
  };

  const calculateAgencyCost = () => {
    const perPage = serviceType === "both" ? 2500 : 1500;
    return 20000 + (pages - 1) * perPage;
  };

  const formatPrice = (price: number) => {
    return "₹" + price.toLocaleString("en-IN");
  };

  const currentPrice = calculatePrice();
  const agencyCost = calculateAgencyCost();
  const savingsPercent = Math.round(((agencyCost - currentPrice) / agencyCost) * 100);
  const sliderPercentage = ((pages - 1) / (20 - 1)) * 100;

  return (
    <div className="w-full min-h-screen bg-bg lg:bg-[#fcfcfc] flex items-center justify-center py-20 md:py-28 overflow-y-auto transition-colors duration-500">
      <section 
        id="calculator-section" 
        className="w-full relative z-20 text-[#050505] flex justify-center items-center px-0 sm:px-6"
      >
        <div className="w-full max-w-[1100px] mx-auto px-0">
          
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 px-6"
          >
            <span className="text-xs text-muted lg:text-zinc-500 uppercase tracking-[0.3em] font-medium block mb-4">
              Instant Estimation
            </span>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-text-primary lg:text-zinc-900 transition-colors duration-500">
              Estimate your project <span className="font-display italic">investment</span>
            </h2>
          </motion.div>

          {/* Master Container: White card on mobile, transparent/borderless grid on laptop */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-none sm:rounded-[24px] lg:rounded-none border-y sm:border-x sm:border border-black/10 lg:border-none bg-[#fcfcfc] lg:bg-transparent shadow-2xl lg:shadow-none transition-all duration-500">
            
            {/* LEFT: 3 Interactive Steps (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 lg:py-4 lg:pl-0 lg:pr-12 lg:border-r lg:border-black/10 gap-8">
              {/* Step 1: Service Type */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="text-[13px] font-semibold text-[#1d1d1f] tracking-tight">
                    1. What do you need built?
                  </label>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    Step 1 of 3
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-black/5 border border-black/5">
                  {[
                    { id: "design", label: "Design", sub: "UI/UX & Figma" },
                    { id: "development", label: "Development", sub: "Clean Code" },
                    { id: "both", label: "Design + Code", sub: "Full Turnkey" },
                  ].map((opt) => {
                    const active = serviceType === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setServiceType(opt.id as any)}
                        className="py-2.5 px-1 sm:p-3 rounded-[10px] text-center transition-all duration-200"
                        style={{
                          backgroundColor: active ? '#ffffff' : 'transparent',
                          border: active ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid transparent',
                          boxShadow: active ? '0 4px 12px rgba(0, 0, 0, 0.05)' : 'none',
                        }}
                      >
                        <div className="text-[11px] sm:text-[13px] font-semibold tracking-tight" style={{ color: active ? '#050505' : '#71717a' }}>
                          {opt.label}
                        </div>
                        <div className="text-[9px] sm:text-[10px] mt-0.5 opacity-80 truncate" style={{ color: active ? '#71717a' : '#a1a1aa' }}>
                          {opt.sub}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Page Count & Scope */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <label className="text-[13px] font-semibold text-[#1d1d1f] tracking-tight">
                    2. Number of pages:
                  </label>
                  
                  {/* Stepper */}
                  <div className="inline-flex items-center bg-white border border-black/10 rounded-lg p-0.5 gap-0.5">
                    <button
                      type="button"
                      onClick={() => setPages(Math.max(1, pages - 1))}
                      className="w-6 h-6 rounded-md flex items-center justify-center text-zinc-500 hover:text-black hover:bg-black/5 transition-all cursor-pointer"
                    >
                      −
                    </button>
                    <span className="text-[13px] font-semibold text-[#050505] min-w-[55px] text-center font-mono">
                      {pages} {pages === 1 ? 'page' : 'pages'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPages(Math.min(20, pages + 1))}
                      className="w-6 h-6 rounded-md flex items-center justify-center text-zinc-500 hover:text-black hover:bg-black/5 transition-all cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Slider */}
                <div className="bg-black/2 border border-black/5 rounded-xl p-4">
                  <div className="relative w-full mb-3.5 flex items-center">
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="1"
                      value={pages}
                      onChange={(e) => setPages(parseInt(e.target.value))}
                      style={{
                        width: '100%',
                        height: '5px',
                        borderRadius: '999px',
                        appearance: 'none',
                        outline: 'none',
                        cursor: 'pointer',
                        background: `linear-gradient(to right, #000000 0%, #000000 ${sliderPercentage}%, rgba(0,0,0,0.1) ${sliderPercentage}%, rgba(0,0,0,0.1) 100%)`
                      }}
                    />
                  </div>

                  {/* Milestone Tiers */}
                  <div className="grid grid-cols-4 gap-1 sm:gap-1.5">
                    {[
                      { label: "Landing", sub: "1 Page", val: 1 },
                      { label: "Standard", sub: "5 Pages", val: 5 },
                      { label: "Growth", sub: "10 Pages", val: 10 },
                      { label: "Portal", sub: "20 Pages", val: 20 },
                    ].map((tier) => {
                      const isSelected = pages === tier.val;
                      return (
                        <button
                          key={tier.val}
                          type="button"
                          onClick={() => setPages(tier.val)}
                          className="py-1.5 rounded-lg text-center transition-all duration-150 border"
                          style={{
                            backgroundColor: isSelected ? '#ffffff' : 'transparent',
                            borderColor: isSelected ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                          }}
                        >
                          <div className="text-[10px] sm:text-[11px] font-semibold" style={{ color: isSelected ? '#050505' : '#71717a' }}>
                            {tier.label}
                          </div>
                          <div className="text-[8px] sm:text-[9px] mt-0.5 font-mono" style={{ color: isSelected ? '#71717a' : '#a1a1aa' }}>
                            {tier.sub}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Step 3: Growth Pack */}
              <div className="flex flex-col gap-3">
                <label className="text-[13px] font-semibold text-[#1d1d1f] tracking-tight">
                  3. Growth Essentials:
                </label>
                
                <div
                  onClick={() => setIncludeGrowthPack(!includeGrowthPack)}
                  className="flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-200"
                  style={{
                    backgroundColor: includeGrowthPack ? 'rgba(0, 0, 0, 0.03)' : 'rgba(0, 0, 0, 0.01)',
                    border: includeGrowthPack ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div 
                      className="flex-shrink-0 w-9 h-5 rounded-full p-0.5 flex items-center transition-colors duration-200"
                      style={{
                        backgroundColor: includeGrowthPack ? '#000000' : '#e4e4e7'
                      }}
                    >
                      <div 
                        className="w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-200"
                        style={{
                          transform: includeGrowthPack ? 'translateX(16px)' : 'translateX(0px)'
                        }}
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="text-[12px] sm:text-[13px] font-semibold" style={{ color: includeGrowthPack ? '#050505' : '#71717a' }}>
                        SEO + Content Pack
                      </div>
                      <div className="hidden sm:block text-[11px] text-zinc-400 mt-0.5 truncate">
                        High-converting copy, meta setup
                      </div>
                    </div>
                  </div>

                  <span className="flex-shrink-0 text-xs text-zinc-500 font-mono ml-4">
                    +₹350 / pg
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT: Live Quote Terminal */}
            <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-10 lg:py-4 lg:pl-12 lg:pr-0 bg-[#f4f4f5] lg:bg-transparent">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] text-zinc-500 font-mono uppercase tracking-[0.08em]">
                    Estimated Investment
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold">
                    Fixed Scope
                  </span>
                </div>

                {/* Price Hero */}
                <div className="my-5">
                  <div className="text-4xl lg:text-5xl font-bold tracking-tight text-[#050505] leading-none">
                    {formatPrice(currentPrice)}
                  </div>
                  <div className="text-xs text-zinc-500 mt-2 font-light">
                    One-time transparent cost • 100% IP ownership
                  </div>
                </div>

                {/* Agency Comparison Pill */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-black/3 border border-black/5 mb-6">
                  <div className="text-xs text-zinc-500">
                    Traditional Agency: <span className="line-through">{formatPrice(agencyCost)}</span>
                  </div>
                  <span className="text-xs text-emerald-600 font-semibold">
                    Save {savingsPercent}%
                  </span>
                </div>

                {/* Feature Checklist */}
                <div className="border-t border-black/10 pt-5 flex flex-col gap-2.5">
                  {[
                    `${pages} page responsive digital experience`,
                    serviceType === "both" ? "Figma design + production Next.js code" : serviceType === "design" ? "Figma UI/UX & design tokens" : "Production Next.js codebase",
                    includeGrowthPack ? "Content copywriting & SEO included" : null,
                    "Turnaround in 7–14 days"
                  ].filter(Boolean).map((item, idx) => (
                    <div key={idx} className="text-xs text-zinc-800 flex items-center gap-2.5">
                      <span className="text-black font-bold text-[10px]">✓</span> {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-8">
                <a
                  href="#contact"
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-black text-white hover:bg-zinc-800 transition-all duration-200 font-semibold text-sm shadow-md hover:scale-[1.01]"
                >
                  <span>Get Started With This Plan</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Custom Slider Thumb Styling */}
        <style>{`
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #000000;
            border: 2px solid #ffffff;
            box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
            cursor: pointer;
          }
          input[type="range"]::-moz-range-thumb {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #000000;
            border: 2px solid #ffffff;
            box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
            cursor: pointer;
          }
        `}</style>
      </section>
    </div>
  );
}
