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
    <div className="w-full min-h-screen bg-bg flex items-start md:items-center justify-center py-24 overflow-y-auto">
      <section 
        id="calculator-section" 
        className="w-full relative z-20 text-[#050505] flex justify-center items-center"
        style={{ 
          backgroundColor: 'transparent',
          paddingTop: 'clamp(40px, 5vw, 80px)',
          paddingBottom: 'clamp(60px, 8vw, 100px)',
          paddingLeft: '20px',
          paddingRight: '20px',
        }}
      >
        <div 
          style={{ 
            maxWidth: '960px', 
            width: '100%',
            margin: '0 auto',
          }}
        >
          {/* Editorial Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 px-6"
          >
            <span className="text-xs text-muted uppercase tracking-[0.3em] font-medium block mb-4">
              Instant Estimation
            </span>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-text-primary">
              Estimate your project <span className="font-display italic">investment</span>
            </h2>
          </motion.div>

          {/* Master Bento Container */}
          <div 
            className="w-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden"
            style={{ 
              backgroundColor: '#fcfcfc',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '24px',
              boxShadow: '0 30px 80px -20px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 1)'
            }}
          >
            {/* LEFT: 3 Streamlined Interactive Steps (7 cols) */}
            <div 
              className="lg:col-span-7 flex flex-col justify-between"
              style={{ 
                padding: 'clamp(28px, 4vw, 42px)',
                borderRight: '1px solid rgba(0, 0, 0, 0.06)',
                gap: '32px'
              }}
            >
              {/* Step 1: Service Type (Segmented Switcher) */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.01em' }}>
                    1. What do you need built?
                  </label>
                  <span style={{ fontSize: '11px', color: '#5e5e5e', fontFamily: 'monospace' }}>
                    Step 1 of 3
                  </span>
                </div>

                <div 
                  className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 p-1 rounded-xl bg-black/5 border border-black/5"
                >
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
                        style={{
                          padding: '12px 8px',
                          borderRadius: '10px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          backgroundColor: active ? '#ffffff' : 'transparent',
                          border: active ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid transparent',
                          boxShadow: active ? '0 4px 12px rgba(0, 0, 0, 0.05)' : 'none',
                          transition: 'all 0.18s ease'
                        }}
                      >
                        <div style={{ fontSize: '13px', fontWeight: active ? 600 : 500, color: active ? '#050505' : '#5e5e5e' }}>
                          {opt.label}
                        </div>
                        <div style={{ fontSize: '10px', color: active ? '#5e5e5e' : '#a1a1aa', marginTop: '2px' }}>
                          {opt.sub}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Page Count & Scope */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.01em' }}>
                    2. Number of pages:
                  </label>
                  
                  {/* Minimalist Numeric Badge Stepper */}
                  <div 
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      backgroundColor: '#ffffff',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: '8px',
                      padding: '2px',
                      gap: '2px'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setPages(Math.max(1, pages - 1))}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#5e5e5e',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'background 0.15s, color 0.15s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                        e.currentTarget.style.color = '#050505';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#5e5e5e';
                      }}
                    >
                      −
                    </button>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#050505', minWidth: '60px', textAlign: 'center', fontFamily: 'monospace' }}>
                      {pages} {pages === 1 ? 'page' : 'pages'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPages(Math.min(20, pages + 1))}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#5e5e5e',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'background 0.15s, color 0.15s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                        e.currentTarget.style.color = '#050505';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#5e5e5e';
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Slider Track Container */}
                <div 
                  style={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    borderRadius: '14px',
                    padding: '16px 16px 14px 16px'
                  }}
                >
                  {/* Range Slider */}
                  <div style={{ position: 'relative', width: '100%', marginBottom: '14px' }}>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="1"
                      value={pages}
                      onChange={(e) => setPages(parseInt(e.target.value))}
                      style={{
                        width: '100%',
                        height: '6px',
                        borderRadius: '999px',
                        appearance: 'none',
                        outline: 'none',
                        cursor: 'pointer',
                        background: `linear-gradient(to right, #000000 0%, #000000 ${sliderPercentage}%, rgba(0,0,0,0.1) ${sliderPercentage}%, rgba(0,0,0,0.1) 100%)`
                      }}
                    />
                  </div>

                  {/* 4 Balanced Full-Width Milestone Tiers */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
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
                          style={{
                            padding: '8px 4px',
                            borderRadius: '8px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            backgroundColor: isSelected ? '#ffffff' : 'transparent',
                            border: isSelected ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ fontSize: '11px', fontWeight: isSelected ? 700 : 500, color: isSelected ? '#050505' : '#5e5e5e' }}>
                            {tier.label}
                          </div>
                          <div style={{ fontSize: '10px', color: isSelected ? '#5e5e5e' : '#a1a1aa', marginTop: '1px', fontFamily: 'monospace' }}>
                            {tier.sub}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Step 3: All-In-One Growth Pack (iOS Style Card Toggle) */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.01em', marginBottom: '12px' }}>
                  3. Growth Essentials:
                </label>
                
                <div
                  onClick={() => setIncludeGrowthPack(!includeGrowthPack)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    userSelect: 'none',
                    backgroundColor: includeGrowthPack ? 'rgba(0, 0, 0, 0.03)' : 'rgba(0, 0, 0, 0.01)',
                    border: includeGrowthPack ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.18s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Switch Indicator */}
                    <div 
                      style={{
                        width: '36px',
                        height: '20px',
                        borderRadius: '999px',
                        backgroundColor: includeGrowthPack ? '#000000' : '#e4e4e7',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: includeGrowthPack ? 'flex-end' : 'flex-start',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div 
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          backgroundColor: '#ffffff',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                        }}
                      />
                    </div>

                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: includeGrowthPack ? '#050505' : '#5e5e5e' }}>
                        SEO + Content Copywriting Pack
                      </div>
                      <div style={{ fontSize: '11px', color: '#5e5e5e', marginTop: '2px' }}>
                        High-converting copy, meta setup, and speed tuning
                      </div>
                    </div>
                  </div>

                  <span style={{ fontSize: '12px', color: '#5e5e5e', fontFamily: 'monospace', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                    +₹350 / pg
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT: Executive Live Quote Terminal (5 cols) */}
            <div 
              className="lg:col-span-5 flex flex-col justify-between"
              style={{ 
                backgroundColor: '#f4f4f5',
                padding: 'clamp(28px, 4vw, 42px)',
                position: 'relative'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#5e5e5e', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Estimated Investment
                  </span>
                  <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '999px', backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#16a34a', fontWeight: 600 }}>
                    Fixed Scope
                  </span>
                </div>

                {/* Price Hero */}
                <div style={{ margin: '14px 0 16px 0' }}>
                  <div style={{ fontSize: 'clamp(40px, 4.5vw, 50px)', fontWeight: 700, color: '#050505', letterSpacing: '-0.04em', lineHeight: 1 }}>
                    {formatPrice(currentPrice)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#5e5e5e', marginTop: '6px' }}>
                    One-time transparent cost • 100% IP ownership
                  </div>
                </div>

                {/* Agency Comparison Pill */}
                <div 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '10px 14px', 
                    borderRadius: '10px', 
                    backgroundColor: 'rgba(0, 0, 0, 0.03)', 
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    marginBottom: '20px'
                  }}
                >
                  <div style={{ fontSize: '11px', color: '#5e5e5e' }}>
                    Traditional Agency: <span style={{ textDecoration: 'line-through' }}>{formatPrice(agencyCost)}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>
                    Save {savingsPercent}%
                  </span>
                </div>

                {/* Feature Checklist */}
                <div style={{ borderTop: '1px solid rgba(0, 0, 0, 0.1)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    `${pages} page responsive digital experience`,
                    serviceType === "both" ? "Figma design + production Next.js code" : serviceType === "design" ? "Figma UI/UX & design tokens" : "Production Next.js codebase",
                    includeGrowthPack ? "Content copywriting & SEO included" : null,
                    "Turnaround in 7–14 days"
                  ].filter(Boolean).map((item, idx) => (
                    <div key={idx} style={{ fontSize: '12px', color: '#1d1d1f', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#050505', fontSize: '10px', fontWeight: 'bold' }}>✓</span> {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <div style={{ marginTop: '28px' }}>
                <a
                  href="#contact"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    backgroundColor: '#050505',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '14px',
                    textAlign: 'center',
                    textDecoration: 'none',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.18s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
                  }}
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
