"use client";
import { Check, X } from "lucide-react";

export default function Comparison() {
  return (
    <section className="py-24 border-t border-white/5 bg-[#080808]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
           <h2 className="text-3xl font-bold tracking-tight text-white">Why are you still typing interfaces?</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* The Old Way (Pain) */}
          <div className="relative rounded-2xl border border-red-500/20 bg-red-500/5 p-8 opacity-70 hover:opacity-100 transition-opacity">
            <div className="absolute top-4 right-4 text-red-500">
               <X className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-red-400 mb-6 font-mono">THE OLD WAY</h3>
            <ul className="space-y-4">
               {[
                 "Manually typing 50+ lines of interfaces",
                 "Debugging 'Property does not exist' errors",
                 "Forgetting to mark optional fields (?)",
                 "Rewriting the whole thing for Zod"
               ].map((item, i) => (
                 <li key={i} className="flex items-start gap-3 text-gray-400">
                    <X className="w-5 h-5 mt-0.5 text-red-900 shrink-0" />
                    <span>{item}</span>
                 </li>
               ))}
            </ul>
          </div>

          {/* The TypeZero Way (Relief) */}
          <div className="relative rounded-2xl border border-sage/20 bg-sage/5 p-8 shadow-[0_0_50px_-20px_rgba(212,255,0,0.1)]">
            <div className="absolute top-4 right-4 text-sage">
               <Check className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-sage mb-6 font-mono">TYPE // ZERO</h3>
            <ul className="space-y-4">
               {[
                 "Instant generation from raw JSON response",
                 "Deep inference for nested objects & arrays",
                 "Auto-detection of optional/nullable fields",
                 "One-click export to TS, Zod, and SQL"
               ].map((item, i) => (
                 <li key={i} className="flex items-start gap-3 text-white">
                    <Check className="w-5 h-5 mt-0.5 text-sage shrink-0" />
                    <span>{item}</span>
                 </li>
               ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}