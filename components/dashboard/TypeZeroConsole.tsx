'use client';
import { useState, useEffect } from 'react';
import CodeWindow from '@/components/CodeWindow';
import { generateTs } from '@/lib/engine/typescript';
import { jsonToZod } from '@/lib/engine/zod';
import { jsonToSql } from '@/lib/engine/sql';
import { jsonToPydantic } from '@/lib/engine/pydantic';
import { FileJson, FileType, Database, ShieldCheck, Box, History, Save, Trash2 } from 'lucide-react';
import { gsap } from 'gsap';

type Mode = 'TS' | 'ZOD' | 'SQL' | 'PYDANTIC';

// 1. The Color Config (The "Chameleon" Logic)
const THEMES: Record<Mode, { color: string; border: string; glow: string; icon: any }> = {
  TS: {
    color: 'text-blue-500',
    border: 'border-blue-500/50',
    glow: 'shadow-[0_0_30px_-10px_rgba(59,130,246,0.5)]',
    icon: FileType,
  },
  ZOD: {
    color: 'text-violet-500',
    border: 'border-violet-500/50',
    glow: 'shadow-[0_0_30px_-10px_rgba(139,92,246,0.5)]',
    icon: ShieldCheck,
  },
  SQL: {
    color: 'text-orange-500',
    border: 'border-orange-500/50',
    glow: 'shadow-[0_0_30px_-10px_rgba(249,115,22,0.5)]',
    icon: Database,
  },
  PYDANTIC: {
    color: 'text-emerald-500',
    border: 'border-emerald-500/50',
    glow: 'shadow-[0_0_30px_-10px_rgba(34,197,94,0.5)]',
    icon: Box,
  },
};

export default function TypeZeroConsole() {
  const [mode, setMode] = useState<Mode>('TS');
  const [input, setInput] = useState('{\n  "id": "1",\n  "status": "active"\n}');
  const [history, setHistory] = useState<string[]>([]); // Mock history

  // The Active Theme
  const theme = THEMES[mode];

  // Logic Switcher
  const output = (() => {
    switch (mode) {
      case 'TS':
        return generateTs(input);
      case 'ZOD':
        return jsonToZod(input);
      case 'SQL':
        return jsonToSql(input);
      case 'PYDANTIC':
        return jsonToPydantic(input);
      default:
        return '';
    }
  })();

  // Animation when mode changes
  useEffect(() => {
    gsap.fromTo('.console-border', { opacity: 0.5 }, { opacity: 1, duration: 0.5, ease: 'power2.out' });
  }, [mode]);

  return (
    <div className="flex h-[calc(100vh-100px)] gap-6">
      {/* 2. The Sidebar (History / Saved) */}
      <aside className="flex w-16 flex-col gap-4 md:w-64">
        {/* New Project Button */}
        <button
          onClick={() => setInput('')}
          className={`group flex h-12 items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 transition-all hover:bg-white/10 md:justify-start md:px-4 ${theme.border} hover:border-opacity-100`}
        >
          <div className={`rounded-lg bg-white/5 p-1.5 group-hover:bg-${mode === 'TS' ? 'blue' : 'violet'}-500/20`}>
            <FileJson className="h-4 w-4 text-gray-400 group-hover:text-white" />
          </div>
          <span className="hidden text-sm font-bold text-gray-400 group-hover:text-white md:block">New Parsing</span>
        </button>

        {/* History List */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-white/5 bg-obsidian-light">
          <div className="flex items-center gap-2 border-b border-white/5 p-4">
            <History className="h-4 w-4 text-gray-500" />
            <span className="hidden font-mono text-xs font-bold text-gray-500 uppercase md:block">Recent Flows</span>
          </div>
          <div className="space-y-1 overflow-y-auto p-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group cursor-pointer rounded-lg p-3 transition-colors hover:bg-white/5">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-300">User_Auth_Response</span>
                  <span className="text-[10px] text-gray-600">2m ago</span>
                </div>
                <div className="flex gap-2">
                  <span className="rounded border border-blue-500/20 bg-blue-500/10 px-1.5 py-0.5 text-[9px] text-blue-500">
                    TS
                  </span>
                  <span className="rounded border border-violet-500/20 bg-violet-500/10 px-1.5 py-0.5 text-[9px] text-violet-500">
                    ZOD
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* 3. The Main Console (The "Sexy" Part) */}
      <main
        className={`console-border relative flex flex-1 flex-col rounded-2xl border ${theme.border} overflow-hidden bg-[#050505] transition-colors duration-500 ${theme.glow}`}
      >
        {/* Console Header (Tabs) */}
        <header className="flex h-16 items-center justify-between border-b border-white/5 bg-[#080808] px-6">
          <div className="flex items-center gap-2">
            <theme.icon className={`h-5 w-5 ${theme.color}`} />
            <span className="font-mono text-sm font-bold tracking-widest text-white uppercase">
              GENERATOR <span className="text-gray-600">//</span> <span className={theme.color}>{mode}</span>
            </span>
          </div>

          {/* Mode Switcher Pills */}
          <div className="flex rounded-lg border border-white/10 bg-black p-1">
            {(Object.keys(THEMES) as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-md px-4 py-1.5 text-[10px] font-black tracking-widest transition-all duration-300 ${
                  mode === m
                    ? `bg-white/10 text-white shadow-lg ${THEMES[m].color}`
                    : 'text-gray-600 hover:text-gray-400'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-white/5 hover:text-white">
              <Save className="h-4 w-4" />
            </button>
            <button className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-white/5 hover:text-red-400">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Split Editor Area */}
        <div className="grid flex-1 grid-cols-1 md:grid-cols-2">
          {/* Input */}
          <div className="group relative border-r border-white/5">
            <div className="absolute top-0 left-0 h-full w-1 bg-white/5 opacity-0 transition-opacity group-hover:opacity-100" />
            <CodeWindow
              title="INPUT_SOURCE.JSON"
              code={input}
              onChange={setInput}
              variant="input"
              className="!h-full rounded-none! !border-none !bg-transparent"
            />
          </div>

          {/* Output */}
          <div className="relative bg-[#030303]">
            {/* Subtle Grid Background for Output */}
            <div
              className={`pointer-events-none absolute inset-0 opacity-5 bg-[radial-gradient(${theme.color}_1px,transparent_1px)] [background-size:16px_16px]`}
            />

            <CodeWindow
              title={`COMPILED_${mode}.${mode.toLowerCase()}`}
              code={output}
              variant="output"
              readOnly
              className={`!h-full !rounded-none !border-none !bg-transparent ${theme.color}`}
            />
          </div>
        </div>

        {/* Console Footer (Status Bar) */}
        <footer className="flex h-8 items-center justify-between border-t border-white/5 bg-[#080808] px-4 font-mono text-[10px] text-gray-600 uppercase">
          <div className="flex gap-4">
            <span>
              STATUS: <span className="text-emerald-500">READY</span>
            </span>
            <span>
              LATENCY: <span className="text-white">12ms</span>
            </span>
          </div>
          <div className="flex gap-4">
            <span>Ln 12, Col 40</span>
            <span>UTF-8</span>
            <span className={theme.color}>{mode} MODE</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
