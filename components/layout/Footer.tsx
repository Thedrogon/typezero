"use client";
import Link from 'next/link';
import { GitFork, Github, Linkedin, Heart, Sparkles, Code2 } from 'lucide-react';
import LegalSection from './LegalSection';

export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-white/10 bg-[#020202] px-6 pt-16 pb-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 grid gap-12 md:grid-cols-4">
          {/* 1. Brand & Mission */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2 text-sage">
              <div className="rounded-sm bg-sage p-1 text-black">
                <Code2 className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tighter text-white">TYPE<span className="text-sage">//</span>ZERO</span>
            </div>
            <p className="max-w-sm leading-relaxed font-mono text-sm text-gray-400">
              Stop writing boilerplate. TypeZero is the autonomous engineering agent that turns raw data into strict type definitions instantly.
            </p>
          </div>

          {/* 2. Links */}
          <LegalSection/>

          {/* 3. The Portfolio "CTA" (Styled Box) */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold tracking-widest text-white uppercase opacity-50">Creator</h4>

            {/* Visual Portfolio Link */}
            <div className="flex flex-col gap-4">

                {/* Signature Quote - Dark Mode Version */}
                <div className="relative rounded-xl border border-white/10 bg-obsidian-light p-5 shadow-[4px_4px_0px_#222] transition-transform hover:-translate-y-1">
                  {/* Accent Line */}
                  <div className="absolute top-4 left-0 h-8 w-1 bg-sage" />

                  <p className="text-[16px] leading-relaxed text-gray-300 italic mb-4">
                    Hi, I’m <span className="font-bold text-white not-italic">Shayan.</span>{' '}
                    If this tool saves you time, check out my other Projects.
                  </p>

                  <div className="flex gap-4 text-[12px] font-bold tracking-wide uppercase">
                    <a
                      href="https://shayanmukherjee.dev"
                      target="_blank"
                      className="text-sage border-b border-sage/20 hover:border-sage transition-all"
                    >
                      Portfolio
                    </a>

                    <a
                      href="https://github.com/thedrogon"
                      target="_blank"
                      className="text-gray-400 border-b border-transparent hover:text-white transition-all"
                    >
                      Github
                    </a>
                  </div>
                </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-8 h-px w-full bg-white/5" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-6 text-sm md:flex-row">
          {/* Copyright */}
          <div className="font-mono text-xs text-gray-400">© {new Date().getFullYear()} TypeZero.</div>

          {/* The "Love & AI" Badge */}
          <div className="flex items-center gap-2 rounded-full border border-white/5 bg-white/2 px-4 py-2">
            <span className="flex items-center gap-1 font-bold text-gray-400 text-xs">
              Made with <Heart className="h-3 w-3 animate-pulse fill-red-500 text-red-500" /> &
            </span>
            <span className="flex items-center gap-1 font-bold text-sage text-xs">
              <Sparkles className="h-3 w-3" /> Gemini
            </span>
          </div>

          {/* Socials */}
          <div className="flex gap-3">
            <a
              href="https://github.com/thedrogon"
              target="_blank"
              className="rounded-md border border-white/5 bg-white/5 p-2 text-gray-400 transition-all hover:bg-white hover:text-black hover:scale-110"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com/in/sayanjit-mukherjee/"
              target="_blank"
              className="rounded-md border border-white/5 bg-white/5 p-2 text-gray-400 transition-all hover:bg-[#0077b5] hover:text-white hover:scale-110"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}