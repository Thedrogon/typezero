'use client';
import { useState, useRef } from 'react';
import CodeWindow from '@/components/CodeWindow';
import { generateTs } from '@/lib/engine/typescript';
import { jsonToZod } from '@/lib/engine/zod';
import { jsonToSql } from '@/lib/engine/sql';
import { jsonToPydantic } from '@/lib/engine/pydantic'; // Import Pydantic
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

// Define supported modes
type Mode = 'TS' | 'ZOD' | 'SQL' | 'PYDANTIC';

// Strategy Pattern: Map modes to their generator functions
const GENERATORS: Record<Mode, (input: string) => string> = {
  TS: generateTs,
  ZOD: jsonToZod,
  SQL: jsonToSql,
  PYDANTIC: jsonToPydantic,
};

export default function DemoSection() {
  const [activeTab, setActiveTab] = useState<Mode>('TS');
  const [input, setInput] = useState(
    `{
  "product": "TypeZero",
  "version": "0.0.4-beta",
  "engine": {
    "core": "WASM",
    "latency_ms": 0
  },
  "developer_experience": {
    "dark_mode": true,
    "pricing": 0,
    "happiness": "🚀"
  }
}`
  );

  const demoRef = useRef<HTMLDivElement>(null);

  // ⚡ The Optimized Logic ⚡
  // No if/else, no ternaries. Just pure O(1) lookup.
  const output = GENERATORS[activeTab](input);

  useGSAP(() => {
    if (!demoRef.current) return;
    gsap.fromTo(
      demoRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  return (
    <section className="relative z-20 -mt-10 px-4 pb-32 perspective-[2000px]">
      <div
        ref={demoRef}
        className="demo-container bg-obsidian-light mx-auto max-w-6xl overflow-hidden rounded-2xl border border-white/10 shadow-[0_0_100px_-20px_rgba(212,255,0,0.1)]"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-white/5 bg-[#111] px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="ml-2 rounded-md border border-white/5 bg-black px-3 py-1 text-gray-400">
              <span>🔒</span> <span className="text-sage font-mono text-xs">typezero.app/engine</span>
            </div>
          </div>

          {/* Dynamic Tab Switcher */}
          <div className="flex rounded-lg border border-white/5 bg-black p-1">
            {(Object.keys(GENERATORS) as Mode[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-md px-3 py-1 text-[10px] font-bold transition-all ${
                  activeTab === tab ? 'bg-sage text-black shadow-lg' : 'text-gray-500 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Split View */}
        <div className="bg-obsidian grid min-h-125 grid-cols-1 md:grid-cols-2">
          {/* Input */}
          <div className="border-r border-white/5">
            <CodeWindow
              title="INPUT.JSON"
              code={input}
              onChange={setInput}
              variant="input"
              mode="json"
              className="h-125! rounded-none! border-none! bg-transparent!"
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
              className="h-125! rounded-none! border-none! bg-transparent!"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
