"use client";
import { useState, useRef } from "react";
import CodeWindow from "@/components/CodeWindow";
import { generateTs } from "@/lib/engine/typescript";
import { jsonToZod } from "@/lib/engine/zod";
import { jsonToSql } from "@/lib/engine/sql";
import { jsonToPydantic } from "@/lib/engine/pydantic"; // Import Pydantic
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// Define supported modes
type Mode = "TS" | "ZOD" | "SQL" | "PYDANTIC";

// Strategy Pattern: Map modes to their generator functions
const GENERATORS: Record<Mode, (input: string) => string> = {
  TS: generateTs,
  ZOD: jsonToZod,
  SQL: jsonToSql,
  PYDANTIC: jsonToPydantic,
};

export default function DemoSection() {
  const [activeTab, setActiveTab] = useState<Mode>("TS");
  const [input, setInput] = useState(
    '{\n  "id": "user_123",\n  "name": "TypeZero",\n  "role": "admin",\n  "active": true\n}',
  );
  
  const demoRef = useRef<HTMLDivElement>(null);

  // ⚡ The Optimized Logic ⚡
  // No if/else, no ternaries. Just pure O(1) lookup.
  const output = GENERATORS[activeTab](input);

  useGSAP(() => {
    if (!demoRef.current) return;
    gsap.fromTo(demoRef.current, 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 }
    );
  }, []);

  return (
    <section className="relative z-20 px-4 pb-32 -mt-10 perspective-[2000px]">
      <div 
        ref={demoRef} 
        className="demo-container max-w-6xl mx-auto bg-obsidian-light rounded-2xl border border-white/10 shadow-[0_0_100px_-20px_rgba(212,255,0,0.1)] overflow-hidden"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#111] border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/20" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
              <div className="w-3 h-3 rounded-full bg-green-500/20" />
            </div>
            <div className="ml-4 px-3 py-1 bg-black rounded-md border border-white/5 text-[10px] text-gray-500 font-mono flex items-center gap-2">
              <span className="text-sage">🔒</span> typezero.app/engine
            </div>
          </div>

          {/* Dynamic Tab Switcher */}
          <div className="flex bg-black rounded-lg p-1 border border-white/5">
            {(Object.keys(GENERATORS) as Mode[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                  activeTab === tab
                    ? "bg-sage text-black shadow-lg"
                    : "text-gray-500 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Split View */}
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-125 bg-obsidian">
          {/* Input */}
          <div className="border-r border-white/5">
            <CodeWindow
              title="INPUT.JSON"
              code={input}
              onChange={setInput}
              variant="input"
              mode="json"
              className="bg-transparent! border-none! h-125! rounded-none!"
            />
          </div>

          {/* Output */}
          <div className="bg-[#080808]">
            <CodeWindow
              title={`OUTPUT.${activeTab.toLowerCase()}`}
              code={output}
              variant="output"
              // Pass the mode to CodeWindow so it knows how to highlight!
              mode={activeTab === 'PYDANTIC' ? 'py' : activeTab === 'SQL' ? 'sql' : 'ts'} 
              readOnly
              className="bg-transparent! border-none! h-125! rounded-none!"
            />
          </div>
        </div>
      </div>
    </section>
  );
}