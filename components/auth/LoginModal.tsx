"use client";
import { X, Github } from "lucide-react";
import { signIn } from "next-auth/react"; // Client-side signin

export default function LoginModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
      />
      
      {/* Card */}
      <div className="relative w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 shadow-2xl transform transition-all scale-100">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#D4FF00] text-black font-black text-xl mb-4">
            T0
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="text-gray-400 text-sm mt-2">Sign in to save your schemas and history.</p>
        </div>

        <button 
          onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-3 rounded-xl hover:scale-[1.02] transition-transform"
        >
          <Github className="w-5 h-5" />
          Continue with GitHub
        </button>
        
        <p className="text-center text-xs text-gray-600 mt-6">
          By continuing, you agree to our Terms of Service.
        </p>
      </div>
    </div>
  );
}