'use client';
import React, { JSX, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CodeWindow from '@/components/CodeWindow';
import { generateTs } from '@/lib/engine/typescript';
import { jsonToZod } from '@/lib/engine/zod';
import { jsonToSql } from '@/lib/engine/sql';
import { jsonToPydantic } from '@/lib/engine/pydantic';
import {
  FileType,
  Database,
  ShieldCheck,
  Box,
  AlertCircle,
  CheckCircle2,
  PanelLeftClose,
  PanelLeftOpen,
  GitCommit,
  Radio,
  Zap,
  Terminal,
  Cpu,
  LayoutTemplate
} from 'lucide-react';
import gsap from 'gsap';

type Mode = 'TS' | 'ZOD' | 'SQL' | 'PYDANTIC';
type Panel = 'input' | 'output';

// UI theme (visual only)
const MODE_THEME: Record<
  Mode,
  { accentClass: string; icon: React.ComponentType<any>; borderClass: string; label: string }
> = {
  TS: { accentClass: 'text-blue-400', icon: FileType, borderClass: 'border-blue-500/30', label: 'TypeScript' },
  ZOD: { accentClass: 'text-violet-400', icon: ShieldCheck, borderClass: 'border-violet-500/30', label: 'Zod' },
  SQL: { accentClass: 'text-orange-400', icon: Database, borderClass: 'border-orange-500/30', label: 'SQL' },
  PYDANTIC: { accentClass: 'text-emerald-400', icon: Box, borderClass: 'border-emerald-500/30', label: 'Pydantic' }
};

// Engine config (logic only)
const MODE_CONFIG: Record<Mode, { run: (json: string) => string; codeMode: 'ts' | 'py' | 'sql' | 'json' }> = {
  TS: { run: generateTs, codeMode: 'ts' },
  ZOD: { run: jsonToZod, codeMode: 'ts' },
  SQL: { run: jsonToSql, codeMode: 'sql' },
  PYDANTIC: { run: jsonToPydantic, codeMode: 'py' }
};

// --- DATA (with stable ids) ---
const BUILD_LOG = [
  { id: 'b-01', step: '01', title: 'Core Engine', desc: 'Regex → AST Upgrade', icon: Cpu, done: true },
  { id: 'b-02', step: '02', title: 'UI Overhaul', desc: 'Obsidian / Sage theme', icon: LayoutTemplate, done: true },
  { id: 'b-03', step: '03', title: 'Inference', desc: 'Recursive types support', icon: Zap, done: true },
  { id: 'b-04', step: '04', title: 'Pydantic', desc: 'Python support added', icon: Box, done: true }
];

const FUTURE_PLANS = [
  { id: 'f-01', title: 'CLI Tool', desc: 'npx typezero watch', icon: Terminal },
  { id: 'f-02', title: 'VS Code Ext', desc: 'Inline generation', icon: FileType },
  { id: 'f-03', title: 'AI Repair', desc: 'Auto-fix invalid JSON', icon: Radio }
];

// --- Small helpers/hooks ---
function useDebounced<T>(value: T, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' ? window.innerWidth < breakpoint : false);
  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth < breakpoint);
    }
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);
  return isMobile;
}

// --- Subcomponents (typed) ---

const DevSidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  // larger, readable typography and spacing for "bonkers" readability
  return (
    <aside
      aria-hidden={!isOpen}
      className={`fixed md:relative z-40 top-0 left-0 h-full transition-all duration-300 ease-in-out
        ${isOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full md:translate-x-0 md:w-0 overflow-hidden'}
        bg-obsidian-light border-r border-white/5 flex flex-col`}
    >
      <div className="flex flex-col h-full w-72">
        <div className="h-14 border-b border-white/6 flex items-center justify-between px-5">
          <span className="font-mono text-[11px] font-semibold text-gray-400 uppercase tracking-wider">SYSTEM LOGS</span>
          <button aria-label="Close sidebar" onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-8">
          {/* Build section */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-3">
              <GitCommit className="w-4 h-4 text-sage" /> Build sequence
            </h3>

            <div className="relative border-l border-white/8 ml-1.5 pl-5 space-y-6">
              {BUILD_LOG.map((item) => (
                <div key={item.id} className="relative group">
                  <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-[#111] border border-white/20 group-hover:border-sage group-hover:bg-sage/25 transition-colors" />
                  <div className="flex flex-col">
                    <span className="text-[12px] font-mono text-gray-500 mb-0.5">{item.step}</span>
                    <span className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">{item.title}</span>
                    <span className="text-[12px] text-gray-400 font-mono">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-3">
              <Radio className="w-4 h-4 text-blue-300" /> Future protocol
            </h3>

            <div className="space-y-3">
              {FUTURE_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className="p-3 rounded-md border border-white/6 bg-white/3 hover:bg-white/6 transition-colors flex items-center gap-3"
                >
                  <div className="p-2 rounded bg-black border border-white/8 text-gray-300">
                    <plan.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-200">{plan.title}</div>
                    <div className="text-[12px] text-gray-400 font-mono">{plan.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/6">
          <div className="text-[12px] text-gray-400 font-mono text-center">v2.0.4 • beta</div>
        </div>
      </div>
    </aside>
  );
};
DevSidebar.displayName = 'DevSidebar';

const ConsoleHeader: React.FC<{
  mode: Mode;
  setMode: (m: Mode) => void;
  theme: { accentClass: string; icon: React.ComponentType<any>; borderClass: string; label: string };
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}> = ({ mode, setMode, theme, toggleSidebar, isSidebarOpen }) => {
  const Icon = theme.icon;
  return (
    <header className="flex h-12 items-center justify-between border-b border-white/6 bg-[#070707] px-4 shrink-0 transition-colors duration-200">
      <div className="flex items-center gap-3">
        <button
          aria-label="Toggle sidebar"
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
        </button>

        <div className="h-5 w-px bg-white/8 mx-1" />

        <Icon className={`${theme.accentClass} h-5 w-5`} />
        <span className="font-mono text-sm font-semibold tracking-wide text-white uppercase hidden md:inline-block">
          Console <span className="text-gray-600 mx-1">/</span> <span className={`${theme.accentClass}`}>{mode}</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex rounded-md border border-white/8 bg-black p-0.5">
          {(Object.keys(MODE_THEME) as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={`rounded-sm px-3 py-1 text-[11px] font-semibold tracking-widest transition-all duration-150 ${
                mode === m ? `bg-white/8 text-white ${MODE_THEME[m].accentClass}` : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="hidden md:flex gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500/25" />
          <div className="w-2 h-2 rounded-full bg-white/10" />
        </div>
      </div>
    </header>
  );
};

// --- MAIN COMPONENT ---
export default function TypeZeroConsole(): JSX.Element {
  const [mode, setMode] = useState<Mode>('TS');
  const [input, setInput] = useState<string>('{ "id": "1", "status": "active" }');
  const [error, setError] = useState<string | null>(null);
  const debouncedInput = useDebounced(input, 450);

  // sidebar: start closed on small, allow open on desktop (user requested)
  const isMobile = useIsMobile();
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(() => (typeof window !== 'undefined' ? window.innerWidth >= 1024 : true));

  // Mobile tabbed panels
  const [activePanel, setActivePanel] = useState<Panel>('input');

  // refs for scoped animations
  const consoleRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLDivElement | null>(null);
  const accentRef = useRef<HTMLDivElement | null>(null);

  const theme = MODE_THEME[mode];
  const engine = MODE_CONFIG[mode];

  // compute output and validity in a side-effect (pure)
  const [output, setOutput] = useState<string>('');
  const [topLevelCount, setTopLevelCount] = useState<number | null>(null);

  useEffect(() => {
    if (!debouncedInput.trim()) {
      setOutput('');
      setError(null);
      setTopLevelCount(null);
      return;
    }

    try {
      const parsed = JSON.parse(debouncedInput);
      // compute a small friendly stat: top-level keys (if object)
      setTopLevelCount(parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? Object.keys(parsed).length : null);

      // run engine; protect against engine exceptions
      try {
        const result = engine.run(debouncedInput);
        setOutput(result);
        setError(null);
      } catch (e) {
        // engine produced an error — don't crash UI
        setOutput('// Generation failed: engine error');
        setError(null);
      }
    } catch (e) {
      setOutput('// Waiting for valid JSON...');
      setError('Invalid JSON');
      // animate shake on invalid parse
      if (inputRef.current) {
        gsap.fromTo(
          inputRef.current,
          { x: -6 },
          { x: 6, duration: 0.08, repeat: 3, yoyo: true, clearProps: 'x' }
        );
      }
    }
  }, [debouncedInput, engine]);

  // animate when mode changes — scoped to console
  useEffect(() => {
    if (!consoleRef.current) return;
    gsap.fromTo(
      consoleRef.current,
      { opacity: 0.92, scale: 0.998 },
      { opacity: 1, scale: 1, duration: 0.28, ease: 'power2.out' }
    );

    // small accent motion (if present)
    if (accentRef.current) {
      gsap.fromTo(accentRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.32, transformOrigin: 'left' });
    }
  }, [mode]);

  // keep sidebar responsive: auto-close on mobile changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
      setActivePanel('input');
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  // Format / prettify handler (memoized)
  const handleFormat = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setInput(formatted);
      setError(null);
      // small highlight animation
      if (inputRef.current) {
        gsap.fromTo(inputRef.current, { backgroundColor: '#0b0b0b' }, { backgroundColor: '#080808', duration: 0.22, clearProps: 'backgroundColor' });
      }
    } catch (e) {
      setError('Invalid JSON syntax');
      if (inputRef.current) {
        gsap.fromTo(inputRef.current, { x: -6 }, { x: 6, duration: 0.08, repeat: 3, yoyo: true, clearProps: 'x' });
      }
    }
  }, [input]);

  // pretty status for footer
  const statusNode = useMemo(() => {
    if (error) {
      return (
        <span className="text-red-400 font-semibold inline-flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> INVALID JSON
        </span>
      );
    }
    if (debouncedInput.trim().length === 0) {
      return <span className="text-gray-400">EMPTY</span>;
    }
    return (
      <span className="text-emerald-400 font-semibold inline-flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4" /> VALID JSON
      </span>
    );
  }, [error, debouncedInput]);

  return (
    <div className="flex h-[calc(100vh-100px)] relative overflow-hidden rounded-xl border border-white/6 bg-[#050507]">
      {/* Sidebar */}
      <DevSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile overlay */}
      {isSidebarOpen && isMobile && (
        <div onClick={() => setSidebarOpen(false)} className="md:hidden absolute inset-0 bg-black/70 z-30 backdrop-blur-sm" />
      )}

      <main ref={consoleRef} className={`relative flex flex-1 flex-col bg-[#070708] transition-all duration-200`}>
        <ConsoleHeader
          mode={mode}
          setMode={(m) => {
            setMode(m);
            // when switching mode, on mobile show output automatically (UX choice)
            if (isMobile) setActivePanel('output');
          }}
          theme={theme}
          toggleSidebar={() => setSidebarOpen((s) => !s)}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Mobile tabs */}
        {isMobile && (
          <div className="flex items-center gap-2 px-3 py-2 border-b border-white/6 bg-[#050506]">
            <button
              onClick={() => setActivePanel('input')}
              className={`flex-1 py-2 rounded-md text-sm font-semibold ${activePanel === 'input' ? 'bg-white/6 text-white' : 'text-gray-400'}`}
            >
              INPUT
            </button>
            <button
              onClick={() => setActivePanel('output')}
              className={`flex-1 py-2 rounded-md text-sm font-semibold ${activePanel === 'output' ? 'bg-white/6 text-white' : 'text-gray-400'}`}
            >
              OUTPUT
            </button>
          </div>
        )}

        {/* Editors area */}
        <div className="grid flex-1 grid-cols-1 md:grid-cols-2 min-h-0">
          {/* Input pane */}
          {( !isMobile || activePanel === 'input' ) && (
            <div ref={inputRef} className="h-full border-r border-white/6 overflow-hidden bg-[#0b0b0c]">
              <CodeWindow
                title="INPUT.JSON"
                code={input}
                onChange={setInput}
                variant="input"
                mode="json"
                onPrettify={handleFormat}
                // styling hooks for CodeWindow (pass-through)
                className="h-full rounded-none border-none bg-transparent"
              />
            </div>
          )}

          {/* Output pane */}
          {( !isMobile || activePanel === 'output' ) && (
            <div className="h-full overflow-auto bg-[#070708]">
              <div className="h-full">
                <CodeWindow
                  title={`OUTPUT.${mode.toLowerCase()}`}
                  code={output}
                  variant="output"
                  mode={engine.codeMode}
                  readOnly
                  className={`h-full rounded-none border-none bg-transparent ${theme.accentClass}`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <footer className="flex h-10 items-center justify-between border-t border-white/6 bg-[#060607] px-4 text-[13px] text-gray-300 shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-gray-400">STATUS</span>
              {statusNode}
            </div>

            <div className="hidden sm:flex items-center gap-3">
              <span className="font-mono text-xs text-gray-400">INFO</span>
              <span className="text-sm">
                {topLevelCount !== null ? `${topLevelCount} top-level keys` : '—'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm font-semibold">
              <span className={`${theme.accentClass}`}>{mode}</span> • <span className="text-gray-400">{MODE_THEME[mode].label}</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => {
                  try {
                    const parsed = JSON.parse(input);
                    const formatted = JSON.stringify(parsed, null, 2);
                    setInput(formatted);
                    setError(null);
                  } catch {
                    setError('Invalid JSON syntax');
                    if (inputRef.current) {
                      gsap.fromTo(inputRef.current, { x: -6 }, { x: 6, duration: 0.08, repeat: 3, yoyo: true, clearProps: 'x' });
                    }
                  }
                }}
                className="px-3 py-1 rounded-md bg-white/6 text-white text-sm font-medium"
                aria-label="Prettify JSON"
              >
                Prettify
              </button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
