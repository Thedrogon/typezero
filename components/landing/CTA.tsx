"use client";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-32 px-4 text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-8">
          Ready to go <br />
          <span className="text-sage">Type // Zero?</span>
        </h2>
        <p className="text-xl text-gray-500 mb-10 max-w-xl mx-auto">
          Join 2,000+ developers saving hours of boilerplate time every week.
        </p>

        <form className="flex flex-col md:flex-row gap-4 justify-center max-w-md mx-auto">
           <input 
             type="email" 
             placeholder="dev@startup.com" 
             className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage transition-all placeholder:text-gray-600"
           />
           <button className="bg-sage text-black font-bold rounded-full px-8 py-4 hover:scale-105 transition-transform flex items-center justify-center gap-2 group">
             Get Early Access
             <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
           </button>
        </form>
        <p className="text-xs text-gray-600 mt-6 font-mono">NO CREDIT CARD REQUIRED • CANCEL ANYTIME</p>
      </div>
    </section>
  );
}