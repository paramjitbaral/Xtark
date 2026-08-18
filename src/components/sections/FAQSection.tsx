"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

const FAQS: FaqItem[] = [
  {
    question: "How long does a typical project take?",
    answer: "Our turnaround time depends on scope. Landing pages and high-impact micro-sites typically ship in 1 to 2 weeks. Comprehensive custom web applications and full brand rebuilds generally take 6 to 12 weeks from discovery to final deployment.",
    category: "Timeline"
  },
  {
    question: "Do you partner with early-stage startups?",
    answer: "Absolutely. We regularly collaborate with venture-backed founders and ambitious startups to design and engineer their initial market-ready digital presence, pitch demos, and conversion-focused web products.",
    category: "Partnership"
  },
  {
    question: "What tech stack and tools do you specialize in?",
    answer: "We build on modern, performant web stacks: Next.js (App Router), React, TypeScript, Tailwind CSS, GSAP, Framer Motion, and WebGL (Three.js). For backend needs, we integrate Supabase, Node.js, and serverless edge APIs.",
    category: "Technology"
  },
  {
    question: "How does the design and revision process work?",
    answer: "We work in transparent weekly sprints. You receive live Figma prototypes, interactive staging links, and direct Slack communication so you have continuous visibility and input at every milestone.",
    category: "Process"
  },
  {
    question: "Do I own 100% of the code and design assets?",
    answer: "Yes, completely. Upon project sign-off and final payment, full intellectual property rights, Figma master files, and GitHub repositories are transferred directly to your organization.",
    category: "Ownership"
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section 
      id="faq-section" 
      className="w-full relative z-20"
      style={{
        backgroundColor: "transparent",
        paddingTop: "clamp(80px, 10vw, 140px)",
        paddingBottom: "clamp(80px, 10vw, 140px)",
        paddingLeft: "clamp(20px, 5vw, 60px)",
        paddingRight: "clamp(20px, 5vw, 60px)",
        borderTop: "1px solid rgba(0, 0, 0, 0.06)"
      }}
    >
      <div 
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "clamp(40px, 6vw, 90px)",
          alignItems: "start"
        }}
      >
        {/* Left Column: Editorial Header */}
        <div style={{ position: "sticky", top: "120px" }}>
          {/* Badge */}
          <div 
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "8px", 
              padding: "6px 14px", 
              borderRadius: "999px", 
              backgroundColor: "rgba(0, 0, 0, 0.04)", 
              border: "1px solid rgba(0, 0, 0, 0.08)",
              marginBottom: "20px" 
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#050505" }} />
            <span style={{ color: "#52525b", fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "monospace" }}>
              Frequently Asked Questions
            </span>
          </div>

          <h2 
            style={{ 
              fontSize: "clamp(36px, 4.5vw, 56px)", 
              fontWeight: 600, 
              color: "#09090b", 
              letterSpacing: "-0.03em", 
              lineHeight: 1.1,
              marginBottom: "18px"
            }}
          >
            Got questions?<br />We have answers.
          </h2>

          <p 
            style={{ 
              fontSize: "17px", 
              color: "#71717a", 
              lineHeight: 1.6, 
              maxWidth: "380px",
              marginBottom: "32px"
            }}
          >
            Clear, transparent answers about our timelines, engineering standards, and working process.
          </p>

          {/* Quick Contact Card */}
          <div 
            style={{
              padding: "24px",
              borderRadius: "16px",
              backgroundColor: "#f4f4f5",
              border: "1px solid rgba(0, 0, 0, 0.06)",
              maxWidth: "380px"
            }}
          >
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
              Have a custom inquiry?
            </div>
            <div style={{ fontSize: "13px", color: "#71717a", marginBottom: "16px" }}>
              We're happy to discuss tailored timelines and technical requirements.
            </div>
            <a 
              href="#contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#09090b",
                textDecoration: "underline",
                textUnderlineOffset: "4px"
              }}
            >
              <span>Speak with our team</span>
              <span>→</span>
            </a>
          </div>
        </div>

        {/* Right Column: Premium Accordion Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                style={{
                  borderRadius: "16px",
                  border: isOpen ? "1px solid rgba(0, 0, 0, 0.15)" : "1px solid rgba(0, 0, 0, 0.07)",
                  backgroundColor: isOpen ? "#fafafa" : "#ffffff",
                  transition: "all 0.25s ease",
                  overflow: "hidden",
                  boxShadow: isOpen ? "0 8px 24px -6px rgba(0, 0, 0, 0.04)" : "none"
                }}
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "24px 28px",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    outline: "none"
                  }}
                >
                  <span 
                    style={{ 
                      fontSize: "clamp(17px, 1.8vw, 21px)", 
                      fontWeight: 600, 
                      letterSpacing: "-0.02em", 
                      color: isOpen ? "#09090b" : "#27272a",
                      paddingRight: "20px",
                      lineHeight: 1.35
                    }}
                  >
                    {faq.question}
                  </span>

                  {/* Clean Icon Toggle */}
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: isOpen ? "#09090b" : "rgba(0, 0, 0, 0.05)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "all 0.25s ease"
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={isOpen ? "#ffffff" : "#09090b"}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.25s ease"
                      }}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div 
                        style={{ 
                          padding: "0 28px 26px 28px", 
                          fontSize: "16px", 
                          color: "#52525b", 
                          lineHeight: 1.65 
                        }}
                      >
                        <div style={{ height: "1px", width: "100%", backgroundColor: "rgba(0, 0, 0, 0.06)", marginBottom: "18px" }} />
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
