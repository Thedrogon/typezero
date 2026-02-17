'use client';
import { useState, useEffect, useMemo } from 'react';
import CodeWindow from '@/components/CodeWindow';
import { generateTs } from '@/lib/engine/typescript';
import { jsonToZod } from '@/lib/engine/zod';
import { jsonToSql } from '@/lib/engine/sql';
import { jsonToPydantic } from '@/lib/engine/pydantic';
import { FileType, Database, ShieldCheck, Box, History, Command, AlertCircle, CheckCircle2 } from 'lucide-react';
import { gsap } from 'gsap';

type Mode = 'TS' | 'ZOD' | 'SQL' | 'PYDANTIC';

const THEMES: Record<Mode, { color: string; border: string; icon: any; mode: "ts" | "json" | "sql" | "py" }> = {
  TS: { color: 'text-blue-500', border: 'border-blue-500/30', icon: FileType, mode: "ts" },
  ZOD: { color: 'text-violet-500', border: 'border-violet-500/30', icon: ShieldCheck, mode: "ts" },
  SQL: { color: 'text-orange-500', border: 'border-orange-500/30', icon: Database, mode: "sql" },
  PYDANTIC: { color: 'text-emerald-500', border: 'border-emerald-500/30', icon: Box, mode: "py" },
};

export default function TypeZeroConsole() {
  const [mode, setMode] = useState<Mode>('TS');
  const [input, setInput] = useState('{\n  "id": "1",\n  "status": "active"\n}');
  const [error, setError] = useState<string | null>(null); // New Error State
  
  const [debouncedInput, setDebouncedInput] = useState(input);

  // Debounce Logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInput(input);
      // Clear error if input is empty or just whitespace
      if (!input.trim()) setError(null);
    }, 600);
    return () => clearTimeout(timer);
  }, [input]);

  const theme = THEMES[mode];

  // Engine Logic
  const output = useMemo(() => {
    if (!debouncedInput.trim()) return "";
    try {
        // Validate JSON before passing to engines to prevent crashes
        JSON.parse(debouncedInput); 
        setError(null); // Clear error if parse succeeds

        switch (mode) {
          case 'TS': return generateTs(debouncedInput);
          case 'ZOD': return jsonToZod(debouncedInput);
          case 'SQL': return jsonToSql(debouncedInput);
          case 'PYDANTIC': return jsonToPydantic(debouncedInput);
          default: return '';
        }
    } catch (e) {
        // Don't set error state here (it flickers while typing), just return comment
        return "// Waiting for valid JSON...";
    }
  }, [debouncedInput, mode]);

  useEffect(() => {
    gsap.fromTo('.console-border', { opacity: 0.8 }, { opacity: 1, duration: 0.3 });
  }, [mode]);

  // Robust Formatter
  const handleFormat = () => {
    try {
        const parsed = JSON.parse(input);
        setInput(JSON.stringify(parsed, null, 2));
        setError(null);
    } catch (e) {
        setError("Invalid JSON syntax");
        // Shake animation for feedback
        gsap.fromTo(".input-window", { x: -5 }, { x: 5, duration: 0.1, repeat: 3, yoyo: true });
    }
  };

  return (
    <div className="flex h-[calc(100vh-100px)] gap-6">
      
      {/* Sidebar - History */}
      <aside className="flex w-16 flex-col gap-4 md:w-64 shrink-0">
        <button
          onClick={() => setInput('')}
          className={`group flex h-10 items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/2 transition-all hover:bg-white/5 md:justify-start md:px-3 ${theme.border}`}
        >
          <Command className="h-4 w-4 text-gray-500 group-hover:text-white" />
          <span className="hidden text-xs font-bold text-gray-400 group-hover:text-white md:block">New Sequence</span>
        </button>

        <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-white/5 bg-obsidian-light">
          <div className="flex items-center gap-2 border-b border-white/5 p-3">
            <History className="h-3 w-3 text-gray-600" />
            <span className="hidden font-mono text-[10px] font-bold text-gray-600 uppercase md:block">SESSION_LOGS</span>
          </div>
          <div className="space-y-0.5 overflow-y-auto p-1">
            {[
              { name: "Auth_Response_v2", type: "TS", time: "1m" },
              { name: "Product_Catalog_Db", type: "SQL", time: "15m" }
            ].map((item, i) => (
              <div key={i} className="group cursor-pointer rounded-md p-2 transition-colors hover:bg-white/5">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-gray-400 group-hover:text-gray-200">{item.name}</span>
                  <span className="text-[9px] text-gray-700">{item.time}</span>
                </div>
                <span className="rounded border border-white/5 bg-white/5 px-1 py-0.5 text-[9px] font-bold text-gray-500">
                  JSON → {item.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Console */}
      <main className={`console-border relative flex flex-1 flex-col rounded-xl border ${theme.border} bg-obsidian overflow-hidden`}>
        {/* Header */}
        <header className="flex h-12 items-center justify-between border-b border-white/5 bg-[#080808] px-4 shrink-0">
          <div className="flex items-center gap-2">
            <theme.icon className={`h-4 w-4 ${theme.color}`} />
            <span className="font-mono text-xs font-bold tracking-widest text-white uppercase">
              CONSOLE <span className="text-gray-700 mx-1">/</span> <span className={theme.color}>{mode}</span>
            </span>
          </div>

          <div className="flex rounded-md border border-white/10 bg-black p-0.5">
            {(Object.keys(THEMES) as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-sm px-3 py-1 text-[9px] font-bold tracking-widest transition-all ${
                  mode === m ? `bg-white/10 text-white ${THEMES[m].color}` : 'text-gray-300 hover:text-gray-400'
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

        {/* Editors - FULL HEIGHT and INDEPENDENT SCROLL */}
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

        {/* STATUS BAR with ERROR FEEDBACK */}
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