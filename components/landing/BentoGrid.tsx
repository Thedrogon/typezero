"use client";
import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Zap, Shield, Cpu, Terminal } from "lucide-react";

// Ensure ScrollTrigger is registered
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const BentoCard = ({ title, subtitle, desc, icon: Icon, children, className = "" }: any) => {
  return (
    <div className={`bento-card group relative overflow-hidden rounded-xl border border-white/10 bg-obsidian-light p-6 md:p-8 transition-all duration-300 hover:border-sage hover:shadow-[0_0_40px_-10px_rgba(212,255,0,0.1)] ${className}`}>
      
      {/* Tech Grid Background (Fixed Syntax) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] opacity-20 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-5 w-5 text-sage" strokeWidth={2.5} />
                    <span className="font-mono text-xs font-bold text-sage/80 uppercase tracking-widest">{subtitle}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">{title}</h3>
            </div>
        </div>

        {/* Content */}
        <p className="text-sm font-mono text-gray-400 leading-relaxed mb-8 border-l-2 border-white/5 pl-4">
            {desc}
        </p>
        
        {/* Visual Slot */}
        <div className="mt-auto pt-4 relative group-hover:scale-[1.02] transition-transform duration-500 ease-out">
           {children}
        </div>
      </div>
    </div>
  );
};

export default function BentoGrid() {
  const container = useRef(null);

  useGSAP(() => {
    // 1. Clear any existing ScrollTriggers to prevent duplicates
    ScrollTrigger.getAll().forEach(t => t.kill());

    // 2. Robust Animation
    gsap.fromTo(".bento-card", 
      { y: 50, opacity: 0, scale: 0.95 },
      { 
        y: 0, 
        opacity: 1, 
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out", // Smoother, less jarring than elastic for debugging
        scrollTrigger: {
          trigger: container.current,
          start: "top 70%", // Triggers earlier (when top of grid hits bottom 15% of screen)
          toggleActions: "play none none reverse"
        },
      }
    );
  }, { scope: container });

  return (
    <section ref={container} className="bento-grid relative py-30 px-4 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="mb-20 text-center">
        <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white uppercase mb-6">
          The Engineering <br />
          {/* Fixed Gradient Syntax */}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-sage to-emerald-400">
            Standard.
          </span>
        </h2>
        <p className="font-mono text-sm text-gray-400 uppercase tracking-widest">
            Built for production environments. Not demos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[420px]">
        
        {/* 1. Large Card: The Engine */}
        <div className="md:col-span-2">
            <BentoCard 
                subtitle="Core Engine"
                title="AST Traversal" 
                desc="We don't just regex your JSON. TypeZero constructs a full Abstract Syntax Tree (AST) to map relationships, union types, and nullable fields with 100% fidelity." 
                icon={Cpu}
                className="h-full"
            >
                {/* Visualization */}
                <div className="w-full h-32 bg-obsidian rounded-lg border border-white/10 p-4 font-mono text-[10px] text-gray-500 relative overflow-hidden">
                    <div className="absolute top-4 left-4 flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-red-400">root</span>
                    </div>
                    <div className="absolute top-12 left-8 flex gap-2 border-l border-white/10 pl-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-blue-400">node_users[]</span>
                    </div>
                    <div className="absolute top-20 left-12 flex gap-2 border-l border-white/10 pl-2">
                        <div className="w-2 h-2 rounded-full bg-sage" />
                        <span className="text-sage">interface User</span>
                    </div>
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-sage/5 to-transparent h-[50%] animate-[scan_2s_linear_infinite]" />
                </div>
            </BentoCard>
        </div>

        {/* 2. Card: Speed */}
        <BentoCard 
          subtitle="Performance"
          title="Zero Latency" 
          desc="Powered by a local WASM runtime. Your sensitive payloads are parsed in-memory and never leave localhost." 
          icon={Zap}
        >
          <div className="flex items-center gap-4 justify-center h-full">
             <div className="text-5xl font-black text-white font-mono tracking-tighter">
                0<span className="text-sage text-2xl">ms</span>
             </div>
             <div className="text-[10px] font-mono text-gray-500 uppercase rotate-90 origin-left translate-y-4">
                Network<br/>Overhead
             </div>
          </div>
        </BentoCard>

        {/* 3. Card: Heuristics */}
        <BentoCard 
          subtitle="Heuristics"
          title="Smart Inference" 
          desc="Detects optional fields (?) by analyzing array variance. If a field is missing in row 500, we mark it optional." 
          icon={Shield}
        >
           <div className="flex flex-col gap-2 w-full text-[10px] font-mono">
              <div className="flex justify-between items-center bg-white/5 p-2 rounded border border-white/5">
                 <span className="text-gray-400">"id": 1</span>
                 <span className="text-sage">number</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-2 rounded border border-white/5 opacity-50">
                 <span className="text-gray-400">"id": null</span>
                 <span className="text-sage">number | null</span>
              </div>
           </div>
        </BentoCard>

        {/* 4. Large Card: Flow State */}
        <div className="md:col-span-2">
            <BentoCard 
                subtitle="DX Experience"
                title="Command Line Feel" 
                desc="Keyboard-first architecture. Vim mode coming soon. We stripped away the UI clutter so you can stay in flow state." 
                icon={Terminal}
                className="h-full"
            >
                <div className="flex gap-4 items-center justify-center opacity-60">
                    <div className="px-3 py-1 bg-white/10 rounded text-xs font-mono text-white">CMD + V</div>
                    <span className="text-gray-600">→</span>
                    <div className="px-3 py-1 bg-white/10 rounded text-xs font-mono text-white">CMD + C</div>
                </div>
            </BentoCard>
        </div>
      </div>
    </section>
  );
}