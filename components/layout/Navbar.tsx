'use client';
import { Github } from 'lucide-react';

interface NavbarProps {
  onLogin?: () => void;
}

export default function Navbar({ onLogin }: NavbarProps) {
  return (
    <nav className="fixed top-0 z-50 w-full bg-transparent backdrop-blur-md pt-4">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* TYPEZERO LOGO */}
        <div className="group relative inline-flex cursor-pointer items-center gap-1.5 select-none">
          {/* Wordmark */}
          <span className="text-sage font-mono text-[26px] tracking-[-0.08em] transition-all duration-300 group-hover:text-white">
            type
          </span>

          {/* Zero Container */}
          <div className="relative flex h-9 w-9 items-center justify-center rounded-md bg-linear-to-b from-[#d4ff00] to-[#a6cc00] shadow-[0_6px_25px_-8px_rgba(212,255,0,0.55)] transition-all duration-300 group-hover:scale-[1.06] group-hover:shadow-[0_10px_40px_-6px_rgba(212,255,0,0.75)]">
            {/* Inner Depth Layer */}
            <div className="absolute inset-px rounded-[5px] bg-[#0a0a0a] transition-all duration-300 group-hover:bg-obsidian" />

            {/* The 0 */}
            <span className="text-sage relative z-10 font-mono text-[22px] font-black transition-all duration-300 group-hover:text-white">
              0
            </span>

            {/* Precision Slash */}
            <div className="absolute z-20 h-[1.5px] w-[140%] rotate-[-38deg] bg-linear-to-r from-transparent via-black/70 to-transparent transition-all duration-300 group-hover:via-black" />

            {/* Specular Highlight */}
            <div className="absolute inset-0 rounded-md bg-linear-to-tr from-white/0 via-white/20 to-white/0 opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-100" />
          </div>

          {/* Ambient Glow (not tied to box, feels expensive) */}
          <div className="absolute -inset-3 -z-10 bg-[radial-gradient(circle_at_center,rgba(212,255,0,0.25),transparent_70%)] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          
          <button
            onClick={onLogin}
            className="bg-obsidian-light hover:border-sage/50 group flex cursor-pointer items-center gap-2 rounded-full border border-white/10 px-5 py-2 text-[15px] font-black tracking-widest text-white transition-all hover:bg-white/10"
          >
            <Github className="group-hover:text-sage h-4 w-4 transition-colors" />
            <span className='text-sage font-mono'>login</span> 
          </button>
        </div>
      </div>
    </nav>
  );
}
