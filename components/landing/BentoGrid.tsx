"use client";
import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Zap, Shield, Layers, Code2, Database, FileJson } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const BentoCard = ({ title, desc, icon: Icon, delay, children }: any) => {
  return (
    <div className="bento-card group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0A] p-8 transition-all hover:border-white/20">
      {/* Hover Gradient Blob */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-sage/5 blur-3xl transition-opacity opacity-0 group-hover:opacity-100 duration-500" />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-sage ring-1 ring-white/10">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="mb-2 text-xl font-bold text-white tracking-tight">{title}</h3>
        <p className="text-sm leading-relaxed text-gray-400 mb-6">{desc}</p>
        
        {/* Visual Slot */}
        <div className="mt-auto overflow-hidden rounded-xl border border-white/5 bg-black/20 p-4 min-h-[100px] flex items-center justify-center relative">
           {children}
        </div>
      </div>
    </div>
  );
};

export default function BentoGrid() {
  useGSAP(() => {
    gsap.from(".bento-card", {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".bento-grid",
        start: "top 80%",
      },
    });
  });

  return (
    <section className="bento-grid relative py-32 px-4 max-w-7xl mx-auto">
      <div className="mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-6">
          Everything you need. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sage to-emerald-400">
            Nothing you don't.
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">
        {/* Large Card: The Ecosystem */}
        <div className="md:col-span-2 bento-card group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0A] p-8">
           <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
           <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                 <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-sage text-black">
                    <Layers className="h-5 w-5" />
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-2">The Universal Translator</h3>
                 <p className="text-gray-400 max-w-md">TypeZero doesn't just do TypeScript. It understands your data structure and translates it into the dialect you need right now.</p>
              </div>
              
              {/* Animated Badges */}
              <div className="flex gap-4 mt-8">
                 {["TypeScript", "Zod Schema", "SQL DDL", "Python Pydantic"].map((tech, i) => (
                    <div key={tech} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-mono font-bold text-gray-300 backdrop-blur-md">
                       {tech}
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Card: Speed */}
        <BentoCard 
          title="Instant Parsing" 
          desc="Zero-latency local processing. Your JSON never leaves your browser." 
          icon={Zap}
        >
          <div className="text-4xl font-black text-sage font-mono animate-pulse">0ms</div>
        </BentoCard>

        {/* Card: Accuracy */}
        <BentoCard 
          title="Type Safety" 
          desc="Recursive inference that handles nested arrays and optional fields automatically." 
          icon={Shield}
        >
           <div className="flex flex-col gap-2 w-full text-[10px] font-mono opacity-60">
              <div className="bg-red-500/20 text-red-400 px-2 py-1 rounded w-3/4">Type 'string' is not assignable</div>
              <div className="bg-sage/20 text-sage px-2 py-1 rounded w-full">No errors found.</div>
           </div>
        </BentoCard>

        {/* Card: Developer Experience */}
        <div className="md:col-span-2 bento-card group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0A] p-8 flex items-center justify-between">
           <div className="max-w-xs">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-sage">
                 <Code2 className="h-5 w-5" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Developer Experience First</h3>
              <p className="text-gray-400">One-click copy, syntax highlighting, and dark mode by default. Built for flow state.</p>
           </div>
           <div className="hidden md:block relative w-64 h-32 bg-[#050505] rounded-xl border border-white/10 p-4 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
               <div className="w-full h-2 bg-white/10 rounded-full mb-2" />
               <div className="w-2/3 h-2 bg-white/10 rounded-full mb-2" />
               <div className="w-4/5 h-2 bg-sage/50 rounded-full mb-2" />
           </div>
        </div>
      </div>
    </section>
  );
}