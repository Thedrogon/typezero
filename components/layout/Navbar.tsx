"use client";
import { Github } from "lucide-react"; // npm install lucide-react

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#030303]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 bg-sage rounded-sm flex items-center justify-center text-black font-black text-xs transition-transform group-hover:rotate-180">
            T0
          </div>
          <span className="font-bold tracking-tight text-white">TYPE<span className="text-sage">//</span>ZERO</span>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          <a href="#" className="hidden md:block text-sm text-gray-400 hover:text-white transition-colors">Docs</a>
          <a href="#" className="hidden md:block text-sm text-gray-400 hover:text-white transition-colors">Pricing</a>
          
          <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs font-bold hover:bg-white/10 transition-all">
            <Github className="w-3 h-3" />
            LOGIN
          </button>
        </div>
      </div>
    </nav>
  );
}