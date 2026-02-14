"use client";
import { useState } from 'react';
import CodeWindow from '@/components/CodeWindow';
import { generateTs } from '@/lib/engine/typescript';
import { jsonToZod } from '@/lib/engine/zod';
import { jsonToSql } from '@/lib/engine/sql';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register ScrollTrigger to animate the demo on scroll
gsap.registerPlugin(ScrollTrigger);

export default function DemoSection() {
  const [activeTab, setActiveTab] = useState<'TS' | 'ZOD' | 'SQL'>('TS');
  const [input, setInput] = useState('{\n  "id": "user_123",\n  "name": "TypeZero",\n  "role": "admin",\n  "active": true\n}');

  // Live transform logic
  const output = activeTab === 'TS' ? generateTs(input) 
               : activeTab === 'ZOD' ? jsonToZod(input)
               : jsonToSql(input);

  useGSAP(() => {
    // 3D Tilt Effect on Scroll
    gsap.fromTo(".demo-container", 
      { rotateX: 20, y: 100, opacity: 0, scale: 0.9 },
      { 
        rotateX: 0, y: 0, opacity: 1, scale: 1,
        duration: 1.5, 
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".demo-container",
            start: "top 85%",
        }
      }
    );
  });

  return (
    <section className="relative z-20 px-4 pb-32 -mt-10 perspective-[2000px]">
      
      {/* The "App Window" Container */}
      <div className="demo-container max-w-300 mx-auto bg-obsidian-light rounded-2xl border border-white/10 shadow-[0_0_100px_-20px_rgba(212,255,0,0.1)] overflow-hidden">
        
        {/* Browser/IDE Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#111] border-b border-white/5">
           <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                 <div className="w-3 h-3 rounded-full bg-red-500/20" />
                 <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                 <div className="w-3 h-3 rounded-full bg-green-500/20" />
              </div>
              
              {/* Fake URL Bar */}
              <div className="ml-4 px-3 py-1 bg-black rounded-md border border-white/5 text-[10px] text-gray-500 font-mono flex items-center gap-2">
                 <span className="text-sage">🔒</span> typezero.app/engine
              </div>
           </div>

           {/* Tab Switcher */}
           <div className="flex bg-black rounded-lg p-1 border border-white/5">
              {['TS', 'ZOD', 'SQL'].map((tab) => (
                 <button 
                   key={tab}
                   onClick={() => setActiveTab(tab as any)}
                   className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                     activeTab === tab 
                     ? 'bg-sage text-black shadow-lg' 
                     : 'text-gray-500 hover:text-white'
                   }`}
                 >
                   {tab}
                 </button>
               ))}
           </div>
        </div>

        {/* The Split View Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-125 bg-obsidian">
            {/* Input */}
            <div className="border-r border-white/5">
                <CodeWindow 
                    title="INPUT.JSON" 
                    code={input} 
                    onChange={setInput} 
                    variant="input" 
                    // Important: We pass a class to remove the default cards border since we are inside a window now
                    className="bg-transparent! border-none! h-125! rounded-none!" 
                />
            </div>

            {/* Output */}
            <div className="bg-[#080808]">
                <CodeWindow 
                    title={`OUTPUT.${activeTab.toLowerCase()}`} 
                    code={output} 
                    variant="output" 
                    readOnly 
                    className="bg-transparent! border-none! h-125! rounded-none!" 
                />
            </div>
        </div>

      </div>
    </section>
  );
}