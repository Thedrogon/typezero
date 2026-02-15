"use client";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import TypeZeroLogo from "@/components/logo";

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {

      gsap.set(contentRef.current, { opacity: 0, y: 60 });
      gsap.set(glowRef.current, { opacity: 0, scale: 0.8 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        }
      });

      tl.to(glowRef.current, {
        opacity: 1,
        scale: 1,
        duration: 1.4,
        ease: "power2.out",
      });

      tl.to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      }, "-=1");

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-30 px-4 text-center overflow-hidden">

      {/* Ambient Lighting */}
      <div
        ref={glowRef}
        className="absolute inset-0 -z-10
        bg-[radial-gradient(circle_at_center,rgba(212,255,0,0.18),transparent_80%)]"
      />

      <div ref={contentRef} className="max-w-3xl mx-auto">

        <div className="flex justify-center mb-8">
          <TypeZeroLogo size={34} />
        </div>

        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-8">
          Ready to eliminate <br />
          <span className="text-sage">schema friction?</span>
        </h2>

        <p className="text-xl text-gray-400 mb-12 max-w-xl mx-auto">
          Paste once. Generate everywhere. Ship faster than your backend can complain.
        </p>

        <form className="flex flex-col md:flex-row gap-4 justify-center max-w-md mx-auto">
          <input
            type="email"
            placeholder="dev@startup.com"
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage transition-all"
          />

          <button className="bg-sage text-black font-bold rounded-full px-6 py-4 flex items-center justify-center gap-2">
            Get Early Access
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <p className="text-xs text-neutral-400 mt-6 font-mono">
          NO CREDIT CARD • JUST LESS SUFFERING
        </p>
      </div>
    </section>
  );
}
