"use client";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LoginModal from "@/components/auth/LoginModal";
import DemoSection from "@/components/landing/DemoSection";
import BentoGrid from "@/components/landing/BentoGrid";
import Comparison from "@/components/landing/Comparison";
import CTA from "@/components/landing/CTA";
import LavaLamp from "@/components/layout/LavaLamp";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function Landing() {
  const [showLogin, setShowLogin] = useState(false);

  useGSAP(() => {
    gsap.from(".hero-text", { y: 50, opacity: 0, duration: 1, stagger: 0.15, ease: "power3.out" });
  });

  return (
    <div className="min-h-screen text-white selection:bg-sage selection:text-black font-sans overflow-x-hidden">
      
      {/* --- LAYER 0: THE LAVA LAMP (Fixed in background) --- */}
      {/* Visible only when content above it is transparent */}
      <LavaLamp />

      <Navbar onLogin={() => setShowLogin(true)} />
      
      {/* --- LAYER 1: TRANSPARENT SECTIONS (Lava Lamp Visible) --- */}
      <div className="relative z-10">
        
        {/* 1. Hero */}
        <section className="relative pt-32 pb-20 text-center px-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-150 bg-sage/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
          
          <div className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 hero-text backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse"/>
              <span className="text-[11px] font-mono tracking-widest text-gray-300 uppercase">v0.0 Beta Live</span>
          </div>

          <h1 className="hero-text text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-6">
            Just paste <br/>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-sage to-emerald-400">
              what you have.
            </span>
          </h1>

          <p className="hero-text text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed mb-10">
            The autonomous engineering agent that transforms raw JSON into strict, production-ready TypeScript, Zod, and SQL.
          </p>

          <div className="hero-text flex justify-center gap-4 mb-12">
             <button 
               onClick={() => setShowLogin(true)}
               className="px-8 py-3 bg-white text-black font-bold rounded-full text-xs tracking-widest hover:scale-105 transition-transform shadow-[0_0_20px_rgba(212,255,0,0.3)]"
             >
               START FOR FREE
             </button>
          </div>
        </section>

        {/* 2. App Demo Window */}
        <DemoSection />
      </div>

      {/* --- LAYER 2: SOLID DARK SECTIONS (Covers Lava Lamp) --- */}
      {/* This div slides up over the fixed lamp, effectively hiding it */}
      <div className="relative z-20 bg-obsidian border-t border-white/5 shadow-[0_-50px_100px_rgba(0,0,0,1)]">
        
        {/* The "Obsidian Sage Patched BG" Effect */}
        {/* A subtle static glow to keep the vibe without the bouncing balls */}
        <div className="absolute  left-1/2 -translate-x-1/2 w-full h-200 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-sage/5 via-obsidian to-transparent pointer-events-none" />

        {/* 3. Trusted By */}
        <div className="py-16 relative">
          <p className="text-center text-sm font-mono text-sage tracking-[0.2em] uppercase mb-12">Powering Next-Gen Teams</p>
          <div className="flex flex-wrap justify-center gap-16 opacity-40 grayscale mix-blend-screen px-4">
              <span className="font-bold text-2xl tracking-tight text-gray-400">ACME CORP</span>
              <span className="font-bold text-2xl tracking-tight text-gray-400">STRIPE</span>
              <span className="font-bold text-2xl tracking-tight text-gray-400">VERCEL</span>
              <span className="font-bold text-2xl tracking-tight text-gray-400">RAYCAST</span>
          </div>
        </div>

        <BentoGrid />

        
        <Comparison />        
        <CTA />
        <Footer />
      </div>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}