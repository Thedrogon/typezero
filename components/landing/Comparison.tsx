"use client";
import { useRef } from "react";
import { Check, X, AlertOctagon, Zap } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Comparison() {
  const container = useRef(null);

  useGSAP(() => {
    gsap.fromTo('.compare-card',
      { 
        y: 100, 
        opacity: 0, 
        rotation: (i) => i === 0 ? -15 : 15 // Start twisted: Left card tilts left, Right card tilts right
      }, 
      { 
        y: 0, 
        opacity: 1, 
        rotation: (i) => i === 0 ? -3 : 3, // Land with a permanent, confident tilt (Human touch)
        duration: 1.2, 
        stagger: 0.15, 
        ease: "elastic.out(1, 0.75)", // Bouncy "Physical" feel
        scrollTrigger: {
          trigger: container.current,
          start: "top 40%",
        }
      }
    );
  }, { scope: container });

  return (
    <section ref={container} className="py-30 bg-obsidian overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header with "Glitch" vibe */}
        <div className="text-center mb-20">
           <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase mb-4">
             Stop Writing <span className="line-through decoration-red-500 decoration-4 text-gray-500">Boilerplate</span>
           </h2>
           <p className="font-mono text-sage text-sm tracking-widest uppercase">
             Evolution is optional. Speed is not.
           </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-8 perspective-[1000px]">
          
          {/* CARD 1: THE OLD WAY (Pain) */}
          <div className="compare-card relative group">
            <div className="absolute inset-0 bg-red-500/10 translate-x-4 translate-y-4 rounded-xl border-2 border-dashed border-red-500/30 -z-10" /> {/* Ghost Shadow */}
            <div className="h-full bg-obsidian-light border-2 border-dashed border-red-500/30 p-8 rounded-xl transition-colors hover:border-red-500/60">
                
                <div className="flex justify-between items-start mb-8">
                    <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20 text-red-500">
                        <AlertOctagon className="w-8 h-8" />
                    </div>
                    <span className="font-mono text-xs font-bold text-red-500/50 uppercase tracking-widest">Legacy Method</span>
                </div>

                <h3 className="text-3xl font-black text-gray-400 mb-6 tracking-tighter decoration-red-500/30 line-through decoration-2">
                    THE MANUAL GRIND
                </h3>

                <ul className="space-y-5 font-mono text-sm">
                {[
                    "Hand-typing 50+ line interfaces",
                    "Debugging 'Implicit Any' errors",
                    "Forgetting optional (?) flags",
                    "Syncing TS types with Zod manually"
                ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 text-gray-500 group-hover:text-red-400 transition-colors">
                        <X className="w-5 h-5 mt-0.5 shrink-0 text-red-500/50" strokeWidth={3} />
                        <span className="leading-tight">{item}</span>
                    </li>
                ))}
                </ul>
            </div>
          </div>

          {/* CARD 2: TYPE // ZERO (Relief) */}
          <div className="compare-card relative z-10">
            {/* Hard Neon Shadow */}
            <div className="absolute inset-0 bg-sage translate-x-2 translate-y-2 md:translate-x-4 md:translate-y-4 rounded-xl -z-10" /> 
            
            <div className="h-full bg-[#0E0E0E] border-2 border-sage p-8 rounded-xl relative overflow-hidden">
                {/* Inner Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-sage/20 blur-[100px] rounded-full pointer-events-none" />

                <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="p-3 bg-sage text-black rounded-lg border-2 border-black font-bold">
                        <Zap className="w-8 h-8 fill-black" />
                    </div>
                    <span className="font-mono text-xs font-bold text-sage uppercase tracking-widest border border-sage/20 px-2 py-1 rounded">V2.0 Engine</span>
                </div>

                <h3 className="text-3xl font-black text-white mb-6 tracking-tighter">
                    TYPE <span className="text-sage">//</span> ZERO
                </h3>

                <ul className="space-y-5 font-mono text-sm relative z-10">
                {[
                    "Instant JSON → Type Inference",
                    "Deep recursive object parsing",
                    "Auto-detects Nullable & Optionals",
                    "One-Click: TS + Zod + SQL Export"
                ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 text-white">
                        <div className="bg-sage/20 p-0.5 rounded text-sage">
                            <Check className="w-4 h-4" strokeWidth={4} />
                        </div>
                        <span className="leading-tight font-bold">{item}</span>
                    </li>
                ))}
                </ul>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}