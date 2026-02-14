"use client";

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface Props {
  title: string;
  code: string;
  onChange?: (val: string) => void;
  readOnly?: boolean;
  variant: "input" | "output";
  className?: string; // Added optional className prop
}

export default function CodeWindow({ title, code, onChange, readOnly, variant, className = "" }: Props) {
  // Dynamic classes based on variant using Tailwind v4 variables
  const isOutput = variant === "output";
  const borderColor = isOutput ? "border-sage/20" : "border-white/10";
  const glow = isOutput ? "shadow-[0_0_50px_-10px_var(--color-sage-dim)]" : "shadow-none";
  const textColor = isOutput ? "text-sage" : "text-gray-400";
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Entrance animation
    gsap.fromTo(containerRef.current, 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: isOutput ? 0.2 : 0 }
    );
  }, [isOutput]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    // Simple visual feedback could be added here
  };

  return (
    <div 
      ref={containerRef} 
      // Merged className prop at the end to allow overrides
      className={`relative flex flex-col bg-obsidian-light rounded-2xl border ${borderColor} ${glow} overflow-hidden transition-all duration-500 hover:border-opacity-40 group ${className}`}
    >
      {/* Mac-style Window Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#111] border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
          </div>
          <span className={`ml-4 text-xs font-bold tracking-widest uppercase ${textColor} font-mono`}>
            {title}
          </span>
        </div>
        
        {isOutput && code && (
          <button 
            onClick={copyToClipboard}
            className="text-[10px] font-bold tracking-widest text-gray-500 hover:text-sage transition-colors uppercase"
          >
            Copy
          </button>
        )}
      </div>

      {/* Editor Area */}
      <div className="relative flex-1">
        <textarea
          value={code}
          onChange={(e) => onChange && onChange(e.target.value)}
          readOnly={readOnly}
          spellCheck={false}
          className={`
            w-full h-full bg-transparent p-6 font-mono text-sm resize-none focus:outline-none 
            ${isOutput ? 'text-gray-300' : 'text-gray-400'}
            placeholder:text-gray-700
            selection:bg-sage selection:text-black
          `}
          placeholder={readOnly ? "// TypeScript interface will appear here..." : "// Paste your raw JSON object here..."}
        />
        
        {/* Subtle decorative line number imitation */}
        <div className="absolute left-0 top-6 bottom-6 w-px bg-white/5 mx-3 pointer-events-none" />
      </div>
    </div>
  );
}