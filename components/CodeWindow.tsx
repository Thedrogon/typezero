'use client';
import React, { useRef, useImperativeHandle, forwardRef, useMemo, useEffect } from 'react';
import { highlightCode } from '@/lib/highlighter';
import gsap from 'gsap';

interface Props {
  title: string;
  code: string;
  onChange?: (val: string) => void;
  readOnly?: boolean;
  variant: 'input' | 'output';
  mode?: 'json' | 'ts' | 'sql' | 'py';
  className?: string;
  onPrettify?: () => void;
}

export interface CodeWindowHandle {
  focus: () => void;
  shake: () => void;
  flash: () => void;
  selectAll: () => void;
}

const CodeWindow = forwardRef<CodeWindowHandle, Props>(
  ({ title, code, onChange, readOnly = false, variant, mode = 'json', className = '', onPrettify }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const preRef = useRef<HTMLPreElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);

    const isOutput = variant === 'output';

    /* ---------------- Highlighting ---------------- */

    // Only re-highlight when code or mode changes.
    // Prevents heavy recalculation during unrelated re-renders.
    const highlighted = useMemo(() => {
      return highlightCode(code, mode);
    }, [code, mode]);

    /* ---------------- Scroll Sync ---------------- */

    const syncScroll = () => {
      if (!textareaRef.current || !preRef.current) return;
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    };

    /* ---------------- TAB Support ---------------- */

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Tab' && !readOnly && onChange && textareaRef.current) {
        e.preventDefault();
        const el = textareaRef.current;
        const start = el.selectionStart;
        const end = el.selectionEnd;

        const newValue = code.slice(0, start) + '  ' + code.slice(end);
        onChange(newValue);

        requestAnimationFrame(() => {
          el.selectionStart = el.selectionEnd = start + 2;
        });
      }
    };

    /* ---------------- Imperative API ---------------- */

    useImperativeHandle(ref, () => ({
      focus() {
        textareaRef.current?.focus();
      },

      selectAll() {
        textareaRef.current?.select();
      },

      shake() {
        if (!rootRef.current) return;
        gsap.fromTo(rootRef.current, { x: -6 }, { x: 6, duration: 0.07, repeat: 3, yoyo: true, clearProps: 'x' });
      },

      flash() {
        if (!rootRef.current) return;
        gsap.fromTo(rootRef.current, { backgroundColor: '#101010' }, { backgroundColor: '#0b0b0c', duration: 0.25 });
      },
    }));

    /* ---------------- Copy ---------------- */

    const copyToClipboard = async () => {
      await navigator.clipboard.writeText(code);
    };

    /* ---------------- Visual System ---------------- */

    const border = isOutput ? 'border-sage/30' : 'border-white/8';

    const surface = isOutput ? 'bg-[#0b0b0c]' : 'bg-[#0f0f10]';

    /* ---------------- Render ---------------- */

    return (
      <div
        ref={rootRef}
        className={`relative flex flex-col rounded-lg border ${border} ${surface} overflow-hidden ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/6 bg-[#111] px-4 py-2">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5 opacity-70">
              <div className="h-3 w-3 rounded-full bg-[#ff5656]" />
              <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
              <div className="h-3 w-3 rounded-full bg-[#27C93F]" />
            </div>

            <span className="font-mono text-xs tracking-wide text-gray-300">{title}</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            {!readOnly && onPrettify && (
              <button onClick={onPrettify} className="text-gray-400 transition-colors hover:text-white">
                Format
              </button>
            )}

            {isOutput && (
              <button onClick={copyToClipboard} className="text-gray-400 transition-colors hover:text-white">
                Copy
              </button>
            )}
          </div>
        </div>

        {/* Editor */}
        <div className="relative min-h-0 flex-1 font-mono text-[14px] leading-[1.6]">
          {/* Highlight Layer */}
          <pre
            ref={preRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden p-6 whitespace-pre text-gray-200"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />

          {/* Input Layer */}
          <textarea
            ref={textareaRef}
            value={code}
            readOnly={readOnly}
            spellCheck={false}
            onScroll={syncScroll}
            onKeyDown={handleKeyDown}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={readOnly ? '' : 'Paste JSON here…'}
            className="selection:bg-sage/25 absolute inset-0 resize-none overflow-auto bg-transparent p-6 text-transparent caret-white focus:outline-none"
          />
        </div>
      </div>
    );
  }
);

CodeWindow.displayName = 'CodeWindow';
export default CodeWindow;
