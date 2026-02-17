'use client';
import { useState, useEffect, useMemo, memo } from 'react';
import CodeWindow from '@/components/CodeWindow';
import { generateTs } from '@/lib/engine/typescript';
import { jsonToZod } from '@/lib/engine/zod';
import { jsonToSql } from '@/lib/engine/sql';
import { jsonToPydantic } from '@/lib/engine/pydantic';
import { 
  FileType, Database, ShieldCheck, Box, 
  AlertCircle, CheckCircle2, 
  PanelLeftClose, PanelLeftOpen, 
  GitCommit, Radio, Zap,
  Terminal, Cpu, LayoutTemplate
} from 'lucide-react';
import { gsap } from 'gsap';

type Mode = 'TS' | 'ZOD' | 'SQL' | 'PYDANTIC';

// --- CONFIGURATION ---
const THEMES: Record<Mode, { color: string; border: string; icon: any; mode: "ts" | "json" | "sql" | "py" }> = {
  TS: { color: 'text-blue-500', border: 'border-blue-500/30', icon: FileType, mode: "ts" },
  ZOD: { color: 'text-violet-500', border: 'border-violet-500/30', icon: ShieldCheck, mode: "ts" },
  SQL: { color: 'text-orange-500', border: 'border-orange-500/30', icon: Database, mode: "sql" },
  PYDANTIC: { color: 'text-emerald-500', border: 'border-emerald-500/30', icon: Box, mode: "py" },
};

// --- DATA: THE DEV STORY ---
const BUILD_LOG = [
  { step: "01", title: "Core Engine", desc: "Regex -> AST Upgrade", icon: Cpu, done: true },
  { step: "02", title: "UI Overhaul", desc: "Obsidian/Sage Theme", icon: LayoutTemplate, done: true },
  { step: "03", title: "Inference", desc: "Recursive Types", icon: Zap, done: true },
  { step: "04", title: "Pydantic", desc: "Python Support Added", icon: Box, done: true },
];

const FUTURE_PLANS = [
  { title: "CLI Tool", desc: "npx typezero watch", icon: Terminal },
  { title: "VS Code Ext", desc: "Inline generation", icon: FileType },
  { title: "AI Repair", desc: "Auto-fix invalid JSON", icon: Radio },
];

// --- SUB-COMPONENTS ---

// 1. Sidebar (The "Dev Log")
const DevSidebar = memo(({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  return (
    <aside 
      className={`
        fixed md:relative z-40 h-full bg-obsidian-light border-r border-white/5 flex-col transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:translate-x-0 md:w-0 overflow-hidden'}
      `}
    >
      <div className="flex flex-col h-full w-64"> {/* Fixed width container to prevent text wrapping during transition */}
        
        {/* Header */}
        <div className="h-12 border-b border-white/5 flex items-center justify-between px-4">
           <span className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest">
             SYSTEM_LOGS
           </span>
           <button onClick={onClose} className="md:hidden text-gray-500">
             <PanelLeftClose className="w-4 h-4" />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-8">
            
            {/* SECTION 1: THE BUILD */}
            <div>
                <h3 className="text-xs font-bold text-white mb-4 flex items-center gap-2">
                    <GitCommit className="w-3 h-3 text-sage" />
                    BUILD_SEQUENCE
                </h3>
                <div className="relative border-l border-white/10 ml-1.5 pl-4 space-y-6">
                    {BUILD_LOG.map((item, i) => (
                        <div key={i} className="relative group">
                            {/* Dot */}
                            <div className="absolute -left-5.25 top-1 w-2.5 h-2.5 rounded-full bg-[#111] border border-white/20 group-hover:border-sage group-hover:bg-sage/20 transition-colors" />
                            
                            <div className="flex flex-col">
                                <span className="text-[10px] font-mono text-gray-600 mb-0.5">{item.step}</span>
                                <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">{item.title}</span>
                                <span className="text-[10px] text-gray-500 font-mono">{item.desc}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* SECTION 2: THE FUTURE */}
            <div>
                <h3 className="text-xs font-bold text-white mb-4 flex items-center gap-2">
                    <Radio className="w-3 h-3 text-blue-400" />
                    FUTURE_PROTOCOL
                </h3>
                <div className="space-y-3">
                    {FUTURE_PLANS.map((plan, i) => (
                        <div key={i} className="p-2 rounded border border-white/5 bg-white/2 hover:bg-white/5 transition-colors flex items-center gap-3">
                            <div className="p-1.5 rounded bg-black border border-white/10 text-gray-400">
                                <plan.icon className="w-3 h-3" />
                            </div>
                            <div>
                                <div className="text-[11px] font-bold text-gray-300">{plan.title}</div>
                                <div className="text-[9px] text-gray-600 font-mono">{plan.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-white/5">
            <div className="text-[9px] text-gray-700 font-mono text-center">
                V2.0.4-BETA // STABLE
            </div>
        </div>
      </div>
    </aside>
  );
});
DevSidebar.displayName = "DevSidebar";


// 2. Header (Optimized)
const ConsoleHeader = ({ mode, setMode, theme, toggleSidebar, isSidebarOpen }: any) => (
  <header className="flex h-12 items-center justify-between border-b border-white/5 bg-[#080808] px-4 shrink-0 transition-colors duration-300">
    <div className="flex items-center gap-3">
      {/* Sidebar Toggle */}
      <button 
        onClick={toggleSidebar}
        className="text-gray-500 hover:text-white transition-colors"
      >
        {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
      </button>

      <div className="h-4 w-px bg-white/10 mx-1" />

      <theme.icon className={`h-4 w-4 ${theme.color}`} />
      <span className="font-mono text-xs font-bold tracking-widest text-white uppercase hidden md:inline-block">
        CONSOLE <span className="text-gray-700 mx-1">/</span> <span className={theme.color}>{mode}</span>
      </span>
    </div>

    {/* The Mode Switcher */}
    <div className="flex rounded-md border border-white/10 bg-black p-0.5">
      {(Object.keys(THEMES) as Mode[]).map((m) => (
        <button
          key={m}
          onClick={() => setMode(m)}
          className={`rounded-sm px-3 py-1 text-[9px] font-bold tracking-widest transition-all duration-200 ${
            mode === m ? `bg-white/10 text-white ${THEMES[m].color}` : 'text-gray-600 hover:text-gray-400'
          }`}
        >
          {m}
        </button>
      ))}
    </div>

    <div className="flex gap-2">
        <div className="w-2 h-2 rounded-full bg-red-500/20" />
        <div className="w-2 h-2 rounded-full bg-white/10" />
    </div>
  </header>
);

// --- MAIN COMPONENT ---

export default function TypeZeroConsole() {
  const [mode, setMode] = useState<Mode>('TS');
  const [input, setInput] = useState('{\n  "id": "1",\n  "status": "active"\n}');
  const [error, setError] = useState<string | null>(null);
  const [debouncedInput, setDebouncedInput] = useState(input);
  
  // Sidebar State (Responsive default)
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Auto-close sidebar on mobile on mount
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, []);

  // Debounce Input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInput(input);
      if (!input.trim()) setError(null);
    }, 600);
    return () => clearTimeout(timer);
  }, [input]);

  const theme = THEMES[mode];

  // Engine Logic
  const output = useMemo(() => {
    if (!debouncedInput.trim()) return "";
    try {
        JSON.parse(debouncedInput); 
        setError(null);

        switch (mode) {
          case 'TS': return generateTs(debouncedInput);
          case 'ZOD': return jsonToZod(debouncedInput);
          case 'SQL': return jsonToSql(debouncedInput);
          case 'PYDANTIC': return jsonToPydantic(debouncedInput);
          default: return '';
        }
    } catch (e) {
        return "// Waiting for valid JSON...";
    }
  }, [debouncedInput, mode]);

  useEffect(() => {
    gsap.fromTo('.console-border', { opacity: 0.8 }, { opacity: 1, duration: 0.3 });
  }, [mode]);

  const handleFormat = () => {
    try {
        const parsed = JSON.parse(input);
        const formatted = JSON.stringify(parsed, null, 2);
        setInput(formatted);
        setError(null);
    } catch (e) {
        setError("Invalid JSON syntax");
        gsap.fromTo(".input-window", { x: -5 }, { x: 5, duration: 0.1, repeat: 3, yoyo: true });
    }
  };

  return (
    <div className="flex h-[calc(100vh-100px)] relative overflow-hidden rounded-xl border border-white/5 bg-[#020202]">
      
      {/* The Sidebar */}
      <DevSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile Overlay (Only visible on mobile when sidebar is open) */}
      {isSidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)}
            className="md:hidden absolute inset-0 bg-black/80 z-30 backdrop-blur-sm"
          />
      )}

      {/* Main Console Area */}
      <main className={`console-border relative flex flex-1 flex-col bg-obsidian transition-all duration-300`}>
        
        <ConsoleHeader 
            mode={mode} 
            setMode={setMode} 
            theme={theme} 
            toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} 
            isSidebarOpen={isSidebarOpen} 
        />

        {/* Editors */}
        <div className="grid flex-1 grid-cols-1 md:grid-cols-2 min-h-0">
          <div className="input-window border-r border-white/5 h-full overflow-hidden">
            <CodeWindow
              title="INPUT.JSON"
              code={input}
              onChange={setInput}
              variant="input"
              mode="json"
              onPrettify={handleFormat}
              className="h-full! rounded-none! border-none! bg-transparent!"
            />
          </div>
          <div className="bg-[#020202] h-full overflow-hidden">
            <CodeWindow
              title={`OUTPUT.${mode.toLowerCase()}`}
              code={output}
              variant="output"
              mode={theme.mode}
              readOnly
              className={`h-full! rounded-none! border-none! bg-transparent! ${theme.color}`}
            />
          </div>
        </div>

        {/* Status Bar */}
        <footer className="flex h-8 items-center justify-between border-t border-white/5 bg-[#080808] px-4 font-sans text-[12px] text-gray-600 uppercase shrink-0">
          <div className="flex gap-4">
            <span className="flex items-center gap-2">
              <span className='text-neutral-400'>STATUS: </span>
              {error ? (
                <span className="text-red-500 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> INVALID JSON
                </span>
              ) : (
                <span className="text-emerald-500 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> READY
                </span>
              )}
            </span>
          </div>
          <div className="flex gap-4">
            <span className={theme.color}>{mode} MODE</span>
          </div>
        </footer>
      </main>
    </div>
  );
}