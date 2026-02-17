'use client';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoginModal from '@/components/auth/LoginModal';
import DemoSection from '@/components/landing/DemoSection';
import BentoGrid from '@/components/landing/BentoGrid';
import Comparison from '@/components/landing/Comparison';
import CTA from '@/components/landing/CTA';
import LavaLamp from '@/components/layout/LavaLamp';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { VERSION, VERSION_TYPE } from '@/lib/constants';

export default function Landing() {
  const [showLogin, setShowLogin] = useState(false);

  useGSAP(() => {
    gsap.from('.hero-text', { y: 50, opacity: 0, duration: 1, stagger: 0.15, ease: 'power3.out' });
  });

  return (
    <div className="selection:bg-sage min-h-screen overflow-x-hidden font-sans text-white selection:text-black">
     
      {/* Visible only when content above it is transparent */}
      <LavaLamp />

      <Navbar onLogin={() => setShowLogin(true)} />

      {/* --- LAYER 1: TRANSPARENT SECTIONS (Lava Lamp Visible) --- */}
      <div className="relative z-10">
        {/* 1. Hero */}
        <section className="relative px-4 pt-32 pb-20 text-center">
          <div className="bg-sage/5 pointer-events-none absolute top-0 left-1/2 -z-10 h-150 w-250 -translate-x-1/2 rounded-full blur-[120px]" />

          <div className="hero-text mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-md">
            <span className="bg-sage h-1.5 w-1.5 animate-pulse rounded-full" />
            <span className="font-mono text-[11px] tracking-widest text-gray-300 uppercase">
              {VERSION} {VERSION_TYPE} Live
            </span>
          </div>

          <h1 className="hero-text mb-6 text-6xl leading-[0.9] font-black tracking-tighter md:text-8xl">
            Just paste <br />
            <span className="from-sage bg-linear-to-r to-emerald-400 bg-clip-text text-transparent">
              what you have.
            </span>
          </h1>

          <p className="hero-text mx-auto mb-10 max-w-2xl text-lg leading-relaxed font-light text-gray-400 md:text-xl">
            Dump your raw JSON payload and watch the engine{' '}
            <span className="font-bold text-neutral-400">violently extract</span> strict TypeScript, Zod, Pydantic and
            SQL schemas.
          </p>

          <div className="hero-text mb-12 flex justify-center gap-4">
            <button
              onClick={() => setShowLogin(true)}
              className="rounded-full bg-white px-8 py-3 text-xs font-bold tracking-widest text-black shadow-[0_0_20px_rgba(212,255,0,0.3)] transition-transform hover:scale-105"
            >
              START FOR FREE
            </button>
          </div>
        </section>

        {/* 2. App Demo Window */}
        <DemoSection />
      </div>

      {/* This div slides up over the fixed lamp, effectively hiding it */}
      <div className="bg-obsidian relative z-20 border-t border-white/5 shadow-[0_-50px_100px_rgba(0,0,0,1)]">
       
        {/* A subtle static glow to keep the vibe without the bouncing balls */}
        <div className="from-sage/5 via-obsidian pointer-events-none absolute left-1/2 h-200 w-full -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] to-transparent" />

        
        <div className="relative py-16">
          <p className="text-sage mb-12 text-center font-mono text-sm tracking-[0.2em] uppercase">
            Powering Next-Gen Teams
          </p>
          <div className="flex flex-wrap justify-center gap-16 px-4 opacity-40 mix-blend-screen grayscale">
            <span className="text-2xl font-bold tracking-tight text-gray-400">ACME CORP</span>
            <span className="text-2xl font-bold tracking-tight text-gray-400">STRIPE</span>
            <span className="text-2xl font-bold tracking-tight text-gray-400">VERCEL</span>
            <span className="text-2xl font-bold tracking-tight text-gray-400">RAYCAST</span>
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
