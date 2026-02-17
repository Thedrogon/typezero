'use client';
import { useState, useEffect } from 'react';
import CodeWindow from '@/components/CodeWindow';
import { generateTs } from '@/lib/engine/typescript';
import { jsonToZod } from '@/lib/engine/zod';
import { jsonToSql } from '@/lib/engine/sql';
import { jsonToPydantic } from '@/lib/engine/pydantic';
import { FileJson, FileType, Database, ShieldCheck, Box, History, Save, Trash2, Command } from 'lucide-react';
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
  const theme = THEMES[mode];

  const output = (() => {
    switch (mode) {
      case 'TS': return generateTs(input);
      case 'ZOD': return jsonToZod(input);
      case 'SQL': return jsonToSql(input);
      case 'PYDANTIC': return jsonToPydantic(input);
      default: return '';
    }
  })();

  useEffect(() => {
    gsap.fromTo('.console-border', { opacity: 0.8 }, { opacity: 1, duration: 0.3 });
  }, [mode]);

  return (
    <div className="flex h-[calc(100vh-100px)] gap-6">
      
      {/* Sidebar - History */}
      <aside className="flex w-16 flex-col gap-4 md:w-64">
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
              { name: "Product_Catalog_Db", type: "SQL", time: "15m" },
              { name: "User_Schema_Final", type: "ZOD", time: "1h" }
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
        <header className="flex h-12 items-center justify-between border-b border-white/5 bg-[#080808] px-4">
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

        {/* Editors */}
        <div className="grid flex-1 grid-cols-1 md:grid-cols-2">
          <div className="border-r border-white/5">
            <CodeWindow
              title="INPUT.JSON"
              code={input}
              onChange={setInput}
              variant="input"
              mode="json"
              className="h-full! rounded-none! border-none! bg-transparent!"
            />
          </div>
          <div className="bg-[#020202]">
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
      </main>
    </div>
  );
}