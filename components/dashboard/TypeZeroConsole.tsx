'use client';
import React, { JSX, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CodeWindow from '@/components/CodeWindow';
import { generateTs } from '@/lib/engine/typescript';
import { jsonToZod } from '@/lib/engine/zod';
import { jsonToSql } from '@/lib/engine/sql';
import { jsonToPydantic } from '@/lib/engine/pydantic';
import {VERSION,VERSION_TYPE} from '@/lib/constants'
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
  LayoutTemplate,
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
  PYDANTIC: { accentClass: 'text-emerald-400', icon: Box, borderClass: 'border-emerald-500/30', label: 'Pydantic' },
};

// Engine config (logic only)
const MODE_CONFIG: Record<Mode, { run: (json: string) => string; codeMode: 'ts' | 'py' | 'sql' | 'json' }> = {
  TS: { run: generateTs, codeMode: 'ts' },
  ZOD: { run: jsonToZod, codeMode: 'ts' },
  SQL: { run: jsonToSql, codeMode: 'sql' },
  PYDANTIC: { run: jsonToPydantic, codeMode: 'py' },
};

// --- DATA (with stable ids) ---
const BUILD_LOG = [
  { id: 'b-01', step: '01', title: 'Core Engine', desc: 'Regex → AST Upgrade', icon: Cpu, done: true },
  { id: 'b-02', step: '02', title: 'UI Overhaul', desc: 'Obsidian / Sage theme', icon: LayoutTemplate, done: true },
  { id: 'b-03', step: '03', title: 'Inference', desc: 'Recursive types support', icon: Zap, done: true },
  { id: 'b-04', step: '04', title: 'Pydantic', desc: 'Python support added', icon: Box, done: true },
];

const FUTURE_PLANS = [
  { id: 'f-01', title: 'CLI Tool', desc: 'npx typezero watch', icon: Terminal },
  { id: 'f-02', title: 'VS Code Ext', desc: 'Inline generation', icon: FileType },
  { id: 'f-03', title: 'AI Repair', desc: 'Auto-fix invalid JSON', icon: Radio },
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
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );
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
      className={`fixed top-0 left-0 z-40 h-full transition-all duration-300 ease-in-out md:relative ${isOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full overflow-hidden md:w-0 md:translate-x-0'} bg-obsidian-light flex flex-col border-r border-white/5`}
    >
      <div className="flex h-full w-72 flex-col">
        <div className="flex h-14 items-center justify-between border-b border-white/6 px-5">
          <span className="font-mono text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
            SYSTEM LOGS
          </span>
          <button aria-label="Close sidebar" onClick={onClose} className="text-gray-400 hover:text-white md:hidden">
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto p-5">
          {/* Build section */}
          <div>
            <h3 className="mb-4 flex items-center gap-3 text-sm font-semibold text-white">
              <GitCommit className="text-sage h-4 w-4" /> Build sequence
            </h3>

            <div className="relative ml-1.5 space-y-6 border-l border-white/8 pl-5">
              {BUILD_LOG.map((item) => (
                <div key={item.id} className="group relative">
                  <div className="group-hover:border-sage group-hover:bg-sage/25 absolute top-1 -left-6 h-3.5 w-3.5 rounded-full border border-white/20 bg-[#111] transition-colors" />
                  <div className="flex flex-col">
                    <span className="mb-0.5 font-mono text-[12px] text-gray-500">{item.step}</span>
                    <span className="text-sm font-semibold text-gray-200 transition-colors group-hover:text-white">
                      {item.title}
                    </span>
                    <span className="font-mono text-[12px] text-gray-400">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 flex items-center gap-3 text-sm font-semibold text-white">
              <Radio className="h-4 w-4 text-blue-300" /> Future protocol
            </h3>

            <div className="space-y-3">
              {FUTURE_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className="flex items-center gap-3 rounded-md border border-white/6 bg-white/3 p-3 transition-colors hover:bg-white/6"
                >
                  <div className="rounded border border-white/8 bg-black p-2 text-gray-300">
                    <plan.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-200">{plan.title}</div>
                    <div className="font-mono text-[12px] text-gray-400">{plan.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/6 p-4">
          <div className="text-center font-mono text-[12px] text-sage">{VERSION} • {VERSION_TYPE}</div>
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
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-white/6 bg-[#070707] px-4 transition-colors duration-200">
      <div className="flex items-center gap-3">
        <button
          aria-label="Toggle sidebar"
          onClick={toggleSidebar}
          className="text-gray-400 transition-colors hover:text-white"
        >
          {isSidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
        </button>

        <div className="mx-1 h-5 w-px bg-white/8" />

        <Icon className={`${theme.accentClass} h-5 w-5`} />
        <span className="hidden font-mono text-sm font-semibold tracking-wide text-white uppercase md:inline-block">
          Console <span className="mx-1 text-gray-600">/</span> <span className={`${theme.accentClass}`}>{mode}</span>
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

        <div className="hidden gap-2 md:flex">
          <div className="h-2 w-2 rounded-full bg-red-500/25" />
          <div className="h-2 w-2 rounded-full bg-white/10" />
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
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );

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
      setTopLevelCount(
        parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? Object.keys(parsed).length : null
      );

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
        gsap.fromTo(inputRef.current, { x: -6 }, { x: 6, duration: 0.08, repeat: 3, yoyo: true, clearProps: 'x' });
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
        gsap.fromTo(
          inputRef.current,
          { backgroundColor: '#0b0b0b' },
          { backgroundColor: '#080808', duration: 0.22, clearProps: 'backgroundColor' }
        );
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
        <span className="inline-flex items-center gap-2 font-semibold text-red-400">
          <AlertCircle className="h-4 w-4" /> INVALID JSON
        </span>
      );
    }
    if (debouncedInput.trim().length === 0) {
      return <span className="text-gray-400">EMPTY</span>;
    }
    return (
      <span className="inline-flex items-center gap-2 font-semibold text-emerald-400">
        <CheckCircle2 className="h-4 w-4" /> VALID JSON
      </span>
    );
  }, [error, debouncedInput]);

  return (
    <div className="relative flex h-[calc(100vh-100px)] overflow-hidden rounded-xl border border-white/6 bg-[#050507]">
      {/* Sidebar */}
      <DevSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile overlay */}
      {isSidebarOpen && isMobile && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="absolute inset-0 z-30 bg-black/70 backdrop-blur-sm md:hidden"
        />
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
          <div className="flex items-center gap-2 border-b border-white/6 bg-[#050506] px-3 py-2">
            <button
              onClick={() => setActivePanel('input')}
              className={`flex-1 rounded-md py-2 text-sm font-semibold ${activePanel === 'input' ? 'bg-white/6 text-white' : 'text-gray-400'}`}
            >
              INPUT
            </button>
            <button
              onClick={() => setActivePanel('output')}
              className={`flex-1 rounded-md py-2 text-sm font-semibold ${activePanel === 'output' ? 'bg-white/6 text-white' : 'text-gray-400'}`}
            >
              OUTPUT
            </button>
          </div>
        )}

        {/* Editors area */}
        <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-2">
          {/* Input pane */}
          {(!isMobile || activePanel === 'input') && (
            <div ref={inputRef} className="h-full overflow-hidden border-r border-white/6 bg-[#0b0b0c]">
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
          {(!isMobile || activePanel === 'output') && (
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
        <footer className="flex h-10 shrink-0 items-center justify-between border-t border-white/6 bg-[#060607] px-4 text-[13px] text-gray-300">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-gray-400">STATUS</span>
              {statusNode}
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <span className="font-mono text-xs text-gray-400">INFO</span>
              <span className="text-sm">{topLevelCount !== null ? `${topLevelCount} top-level keys` : '—'}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm font-semibold">
              <span className={`${theme.accentClass}`}>{mode}</span> •{' '}
              <span className="text-gray-400">{MODE_THEME[mode].label}</span>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
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
                      gsap.fromTo(
                        inputRef.current,
                        { x: -6 },
                        { x: 6, duration: 0.08, repeat: 3, yoyo: true, clearProps: 'x' }
                      );
                    }
                  }
                }}
                className="rounded-md bg-white/6 px-3 py-1 text-sm font-medium text-white"
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
