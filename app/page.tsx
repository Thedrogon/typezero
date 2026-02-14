"use client";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LoginModal from "@/components/auth/LoginModal";
import DemoSection from "@/components/landing/DemoSection";
import BentoGrid from "@/components/landing/BentoGrid";
import Comparison from "@/components/landing/Comparison";
import CTA from "@/components/landing/CTA";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function Landing() {
  const [showLogin, setShowLogin] = useState(false);

  useGSAP(() => {
    gsap.from(".hero-text", { y: 50, opacity: 0, duration: 1, stagger: 0.15, ease: "power3.out" });
  });

  return (
    <div className="min-h-screen bg-obsidian text-white selection:bg-sage selection:text-black font-sans overflow-x-hidden">
      <Navbar onLogin={() => setShowLogin(true)} />
      
      {/* 1. Hero */}
      <section className="relative pt-32 pb-20 text-center px-4 z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-150 bg-sage/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
        
        <div className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 hero-text backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse"/>
            <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">v2.0 Beta Live</span>
        </div>

        <h1 className="hero-text text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-6">
          Just paste <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-sage to-emerald-400">
            what you have.
          </span>
        </h1>

        <p className="hero-text text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-light leading-relaxed mb-10">
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

      {/* 3. Trusted By (Social Proof) */}
      <div className="py-12 border-y border-white/5 bg-[#030303]/50 backdrop-blur-sm">
        <p className="text-center text-[10px] font-mono text-gray-700 tracking-[0.2em] uppercase mb-8">Powering Next-Gen Teams</p>
        <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale mix-blend-screen px-4">
             {/* Replace these spans with actual SVGs for production */}
            <span className="font-bold text-lg tracking-tight">ACME CORP</span>
            <span className="font-bold text-lg tracking-tight">STRIPE</span>
            <span className="font-bold text-lg tracking-tight">VERCEL</span>
            <span className="font-bold text-lg tracking-tight">RAYCAST</span>
        </div>
      </div>

      {/* 4. Features (Bento) */}
      <BentoGrid />

      {/* 5. Pain vs Relief (Value Prop) */}
      <Comparison />

      {/* 6. CTA */}
      <CTA />

      {/* 7. Footer */}
      <Footer />

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}