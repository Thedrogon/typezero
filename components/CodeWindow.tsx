"use client";
import React, { useRef } from 'react';
import { highlightCode } from '@/lib/highlighter';

interface Props {
  title: string;
  code: string;
  onChange?: (val: string) => void;
  readOnly?: boolean;
  variant: "input" | "output";
  mode?: "json" | "ts" | "sql" | "py"; // Added mode for highlighting
  className?: string; 
}

export default function CodeWindow({ title, code, onChange, readOnly, variant, mode = "json", className = "" }: Props) {
  const isOutput = variant === "output";
  // Toned down border and glow for "Pro" look
  const borderColor = isOutput ? "border-sage/20" : "border-white/5"; 
  const textColor = isOutput ? "text-sage" : "text-gray-400";
  
  const copyToClipboard = () => navigator.clipboard.writeText(code);

  // Generate Highlighted HTML
  const highlightedHtml = highlightCode(code, mode);

  return (
    <div className={`relative flex flex-col bg-obsidian-light rounded-lg border ${borderColor} overflow-hidden group ${className}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#111] border-b border-white/5 select-none">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5 opacity-40">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
          </div>
          <span className={`ml-2 text-[10px] font-bold tracking-widest uppercase ${textColor} font-mono opacity-80`}>
            {title}
          </span>
        </div>
        
        {isOutput && code && (
          <button 
            onClick={copyToClipboard}
            className="text-[9px] font-bold tracking-widest text-gray-600 hover:text-sage transition-colors uppercase"
          >
            Copy
          </button>
        )}
      </div>

      {/* Editor Area */}
      <div className="relative flex-1 overflow-hidden">
        
        {/* 1. Syntax Layer (Behind) */}
        <pre 
          className="absolute inset-0 p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap wrap-break-word pointer-events-none z-0"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          style={{ fontFamily: '"Geist Mono", monospace' }} 
        />

        {/* 2. Input Layer (Transparent Textarea) */}
        <textarea
          value={code}
          onChange={(e) => onChange && onChange(e.target.value)}
          readOnly={readOnly}
          spellCheck={false}
          className={`
            relative z-10 w-full h-full bg-transparent p-6 font-mono text-sm leading-relaxed resize-none focus:outline-none 
            text-transparent caret-white selection:bg-sage/30
            ${readOnly ? 'cursor-default' : ''}
          `}
          style={{ fontFamily: '"Geist Mono", monospace' }}
          placeholder={readOnly ? "" : "// Paste JSON..."}
        />
      </div>
    </div>
  );
}