"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function TypeZeroLogo({ size = 32 }: { size?: number }) {
  const root = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const slash = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!root.current) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(root.current, {
      opacity: 0,
      y: 8,
      duration: 0.6,
    });

    tl.from(box.current, {
      scale: 0.85,
      rotateX: 25,
      duration: 0.7,
    }, "-=0.4");

    tl.from(slash.current, {
      scaleX: 0,
      transformOrigin: "center",
      duration: 0.5,
    }, "-=0.5");

  }, []);

  return (
    <div ref={root} className="relative inline-flex items-center gap-1.5 select-none">
      <span className="text-[22px] font-mono tracking-[-0.08em] text-sage">
        type
      </span>

      <div
        ref={box}
        style={{ width: size, height: size }}
        className="relative rounded-md flex items-center justify-center
        bg-linear-to-b from-[#d4ff00] to-[#a6cc00]
        shadow-[0_10px_35px_-8px_rgba(212,255,0,0.6)]"
      >
        <div className="absolute inset-px rounded-[5px] bg-obsidian" />

        <span className="relative z-10 font-mono font-black text-[18px] text-sage">
          0
        </span>

        <div
          ref={slash}
          className="absolute w-[140%] h-[1.5px]
          bg-linear-to-r from-transparent via-black/70 to-transparent
          rotate-[-38deg]"
        />
      </div>
    </div>
  );
}
