'use client';
import React, { useRef } from 'react';
import { highlightCode } from '@/lib/highlighter';

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

export default function CodeWindow({
  title,
  code,
  onChange,
  readOnly,
  variant,
  mode = 'json',
  className = '',
  onPrettify,
}: Props) {
  const isOutput = variant === 'output';
  const borderColor = isOutput ? 'border-sage/20' : 'border-white/5';
  const textColor = isOutput ? 'text-sage' : 'text-gray-400';

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  // SCROLL SYNC: Locks the layers together
  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  // TAB KEY SUPPORT (2 Spaces)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && !readOnly && onChange) {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newValue = code.substring(0, start) + '  ' + code.substring(end);
      onChange(newValue);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const copyToClipboard = () => navigator.clipboard.writeText(code);

  return (
    <div
      className={`bg-obsidian-light relative flex flex-col rounded-lg border ${borderColor} group h-full overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-white/5 bg-[#111] px-4 py-2 select-none">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5 opacity-60">
            <div className="h-2.5 w-2.5 rounded-full bg-[#ff5656]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
          </div>
          <span className={`text-sage ml-2 font-mono text-[10px] font-bold tracking-widest uppercase`}>{title}</span>
        </div>

        <div className="flex items-center gap-3">
          {!readOnly && onPrettify && (
            <button
              onClick={onPrettify}
              className="text-sage text-[10px] font-bold tracking-widest uppercase transition-colors hover:text-white"
            >
              Format
            </button>
          )}
          {isOutput && code && (
            <button
              onClick={copyToClipboard}
              className="text-sage text-[10px] font-bold tracking-widest uppercase transition-colors hover:text-white"
            >
              Copy
            </button>
          )}
        </div>
      </div>

      {/* Editor Area */}
      <div className="bg-obsidian-light relative min-h-0 flex-1">
        {/* SHARED STYLES FOR ALIGNMENT */}
        {/* We use inline styles to enforce strict pixel matching between layers */}
        <style jsx>{`
          .editor-font {
            font-family: 'Geist Mono', 'Fira Code', 'Menlo', monospace;
            font-size: 13px;
            line-height: 1.5; /* Strict line height */
            letter-spacing: 0px;
            padding: 24px; /* p-6 equivalent */
          }
        `}</style>

        {/* 1. Syntax Layer (Passive) */}
        <pre
          ref={preRef}
          className="editor-font pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden text-left whitespace-pre"
          dangerouslySetInnerHTML={{ __html: highlightCode(code, mode) }}
        />

        {/* 2. Input Layer (Active) */}
        <textarea
          ref={textareaRef}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          name="textarea"
          value={code}
          onChange={(e) => onChange && onChange(e.target.value)}
          readOnly={readOnly}
          spellCheck={false}
          className={`editor-font selection:bg-sage/20 absolute inset-0 z-10 h-full w-full resize-none overflow-auto bg-transparent whitespace-pre text-transparent caret-white focus:outline-none ${readOnly ? 'cursor-default' : ''} `}
          placeholder={readOnly ? '' : '// Paste raw JSON here...'}
        />
      </div>
    </div>
  );
}
