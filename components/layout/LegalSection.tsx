"use client";
import { useState } from "react";
import { X, ShieldAlert, Mail } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function LegalSection() {
  const [isOpen, setIsOpen] = useState(false);

  // Animation for the modal
  useGSAP(() => {
    if (isOpen) {
      gsap.fromTo(".legal-modal", 
        { scale: 0.9, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
      );
    }
  }, [isOpen]);

  return (
    <>
      <div className="flex flex-col gap-4">
        <h4 className="text-sm font-bold tracking-widest text-white uppercase opacity-50">Legal & Contact</h4>
        
        {/* 1. The Protocol Button (Terms + Privacy) */}
        <button
          onClick={() => setIsOpen(true)}
          className="text-[15px] font-medium text-gray-400 text-left transition-all hover:translate-x-1 hover:text-sage flex items-center gap-2"
        >
          <ShieldAlert className="w-4 h-4" />
          TypeZero Protocol
        </button>

        {/* 2. Mail Me */}
        <a
          href="mailto:aec.sayanjitmukherjee@gmail.com"
          className="text-[15px] font-medium text-gray-400 transition-all hover:translate-x-1 hover:text-sage flex items-center gap-2"
        >
          <Mail className="w-4 h-4" />
          Mail Me
        </a>
      </div>

      {/* --- THE LEGAL MODAL --- */}
      {isOpen && (
        <div className="fixed inset-0 z-999 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)}
          />

          {/* The Card */}
          <div className="legal-modal relative w-full max-w-lg bg-obsidian-light border border-sage/20 rounded-2xl shadow-[0_0_50px_-10px_rgba(212,255,0,0.1)] overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5 bg-[#111]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-sage animate-pulse" />
                <span className="text-sm font-bold tracking-widest text-white uppercase">TypeZero Protocol</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content (Scrollable) */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-sm leading-relaxed text-gray-400">
              
              <div className="p-3 bg-sage/5 border border-sage/10 rounded-lg">
                <p className="text-xs font-mono text-sage">
                  <span className="font-bold">NOTICE:</span> This is an experimental engineering tool forged by a human architect and an AI agent. Not for enterprise use.
                </p>
              </div>

              <div>
                <h4 className="text-white font-bold mb-2">1. The Zero-Knowledge Promise</h4>
                <p>
                  We operate on a strict <span className="text-gray-300">local-first architecture</span>. 
                  When you paste JSON into the TypeZero engine, it is processed exclusively in your browser&apos;s memory. 
                  Your payloads <strong>never leave your machine</strong>. When you close the tab, your data vanishes.
                </p>
              </div>

              <div>
                <h4 className="text-white font-bold mb-2">2. Liability & Usage</h4>
                <p>
                  This tool is provided &quot;as-is&quot;. While we strive for strict inference, the generated schemas are algorithmic suggestions. 
                  <strong>You are the final editor.</strong> We accept no liability for the code generated.
                </p>
              </div>

              <div>
                <h4 className="text-white font-bold mb-2">3. The Indie Spirit</h4>
                <p>
                  TypeZero is not a faceless corporation. It is a passion project built to kill boilerplate. 
                  By using this tool, you acknowledge that this is an individual initiative designed to empower developers.
                </p>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/5 bg-obsidian flex justify-end">
              <button 
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 bg-white text-black text-xs font-bold rounded hover:bg-sage transition-colors"
              >
                ACKNOWLEDGE
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}