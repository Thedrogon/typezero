"use client";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";

export default function Hero() {
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    gsap.fromTo(textRef.current, 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power4.out", delay: 0.2 }
    );
  }, []);

  return (
    <section className="pt-32 pb-20 text-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-125 bg-sage/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse"/>
            <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">v2.0 Public Beta</span>
        </div>

        <h1 ref={textRef} className="text-7xl md:text-9xl font-bold tracking-tighter text-white leading-[0.9] mb-6">
          JSON is <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-sage to-emerald-400">
            messy.
          </span>
        </h1>

        <p className="text-xl text-gray-500 max-w-xl mx-auto font-light leading-relaxed">
          The instant type inference engine for developers who hate writing interfaces.
          <span className="block mt-2 text-white/50">Supports TS, Zod, and SQL.</span>
        </p>
      </div>
    </section>
  );
}