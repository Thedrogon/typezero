'use client';
import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Zap, Shield, Cpu, Terminal } from 'lucide-react';

// Ensure ScrollTrigger is registered
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const BentoCard = ({ title, subtitle, desc, icon: Icon, children, className = '' }: any) => {
  return (
    <div
      className={`bento-card group bg-obsidian-light hover:border-sage relative overflow-hidden rounded-xl border border-white/10 p-6 transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(212,255,0,0.1)] md:p-8 ${className}`}
    >
      {/* Tech Grid Background (Fixed Syntax) */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] opacity-20" />

      <div className="relative z-10 flex h-full flex-col">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Icon className="text-sage h-5 w-5" strokeWidth={2.5} />
              <span className="text-sage/80 font-mono text-xs font-bold tracking-widest uppercase">{subtitle}</span>
            </div>
            <h3 className="text-xl font-black tracking-tight text-white uppercase md:text-2xl">{title}</h3>
          </div>
        </div>

        {/* Content */}
        <p className="mb-8 border-l-2 border-white/5 pl-4 font-mono text-sm leading-relaxed text-gray-400">{desc}</p>

        {/* Visual Slot */}
        <div className="relative mt-auto pt-4 transition-transform duration-500 ease-out group-hover:scale-[1.02]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function BentoGrid() {
  const container = useRef(null);

  useGSAP(
    () => {
      // 1. Clear any existing ScrollTriggers to prevent duplicates
      ScrollTrigger.getAll().forEach((t) => t.kill());

      // 2. Robust Animation
      gsap.fromTo(
        '.bento-card',
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out', // Smoother, less jarring than elastic for debugging
          scrollTrigger: {
            trigger: container.current,
            start: 'top 70%', // Triggers earlier (when top of grid hits bottom 15% of screen)
            toggleActions: 'play none none reverse',
          },
        }
      );
    },
    { scope: container }
  );

  return (
    <section ref={container} className="bento-grid relative mx-auto max-w-7xl px-4 py-30">
      {/* Section Header */}
      <div className="mb-20 text-center">
        <h2 className="mb-6 text-5xl font-black tracking-tighter text-white uppercase md:text-6xl">
          The Engineering <br />
          {/* Fixed Gradient Syntax */}
          <span className="from-sage bg-linear-to-r to-emerald-400 bg-clip-text text-transparent">Standard.</span>
        </h2>
        <p className="font-mono text-sm tracking-widest text-gray-400 uppercase">
          Built for production environments. Not demos.
        </p>
      </div>

      <div className="grid auto-rows-[420px] grid-cols-1 gap-6 md:grid-cols-3">
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
            <div className="bg-obsidian relative h-32 w-full overflow-hidden rounded-lg border border-white/10 p-4 font-mono text-[10px] text-gray-500">
              <div className="absolute top-4 left-4 flex gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-red-400">root</span>
              </div>
              <div className="absolute top-12 left-8 flex gap-2 border-l border-white/10 pl-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="text-blue-400">node_users[]</span>
              </div>
              <div className="absolute top-20 left-12 flex gap-2 border-l border-white/10 pl-2">
                <div className="bg-sage h-2 w-2 rounded-full" />
                <span className="text-sage">interface User</span>
              </div>
              <div className="via-sage/5 absolute inset-0 h-[50%] animate-[scan_2s_linear_infinite] bg-linear-to-b from-transparent to-transparent" />
            </div>
          </BentoCard>
        </div>

        {/* 2. Card: Speed */}
        <BentoCard
          title="Instant Parsing"
          desc="Zero-latency, local processing. Your JSON never leaves your browser."
          icon={Zap}
        >
          <div className="flex w-full items-center justify-center gap-6">
            {/* The Metric */}
            <div className="relative">
              <div className="relative z-10 font-mono text-6xl font-black tracking-tighter text-white">
                0<span className="text-sage text-3xl p-1">ms</span>
              </div>
              {/* Glow Effect */}
              <div className="bg-sage/20 absolute inset-0 rounded-full blur-2xl" />
            </div>

            

            {/* The Label */}
            <div className="flex flex-col justify-center">
              <span className="font-mono text-[11px] leading-tight tracking-widest text-gray-300 uppercase">
                Network
                <br />
                Overhead
              </span>
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
          <div className="flex w-full flex-col gap-2 font-mono text-[10px]">
            <div className="flex items-center justify-between rounded border border-white/5 bg-white/5 p-2">
              <span className="text-gray-400">"id": 1</span>
              <span className="text-sage">number</span>
            </div>
            <div className="flex items-center justify-between rounded border border-white/5 bg-white/5 p-2 opacity-50">
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
            <div className="flex items-center justify-center gap-4 opacity-60">
              <div className="rounded bg-white/10 px-3 py-1 font-mono text-xs text-white">CMD + V</div>
              <span className="text-gray-600">→</span>
              <div className="rounded bg-white/10 px-3 py-1 font-mono text-xs text-white">CMD + C</div>
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}
