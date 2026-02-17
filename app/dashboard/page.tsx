import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import TypeZeroConsole from "@/components/dashboard/TypeZeroConsole";
import { LogOut, User } from "lucide-react";

export default async function Dashboard() {
  const session = await auth();
  if (!session) redirect("/");

  return (
    <div className="min-h-screen bg-[#020202] text-white overflow-hidden">
      
      {/* Dashboard Nav */}
      <nav className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-obsidian">
        <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-sage rounded-sm flex items-center justify-center text-black font-black text-xs shadow-[0_0_10px_-2px_rgba(212,255,0,0.5)]">T0</div>
             <span className="font-bold tracking-tight text-lg">Console</span>
        </div>
        
        {/* User Dropdown (Simple CSS Hover) */}
        <div className="relative group z-50">
           <button className="flex items-center gap-3 pl-4 border-l border-white/10 outline-none">
              <div className="text-right hidden md:block">
                 <div className="text-xs font-bold text-white">{session.user?.name}</div>
                 <div className="text-[10px] text-gray-500 font-mono">PRO PLAN</div>
              </div>
              {session.user?.image ? (
                 <Image src={session.user.image} alt="Profile" width={32} height={32} className="rounded-full border border-white/20" />
              ) : (
                 <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><User className="w-4 h-4"/></div>
              )}
           </button>

           {/* Dropdown Menu */}
           <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-white/10 bg-obsidian-light shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
              <div className="p-3 border-b border-white/5">
                 <p className="text-[10px] text-gray-500 uppercase font-bold">Signed in as</p>
                 <p className="text-xs font-bold text-white truncate">{session.user?.email || "GitHub User"}</p>
              </div>
              <form action={async () => { "use server"; await signOut(); }}>
                <button className="w-full text-left px-4 py-3 text-xs font-bold text-red-400 hover:bg-white/5 hover:text-red-300 flex items-center gap-2 transition-colors">
                   <LogOut className="w-3 h-3" />
                   SIGN OUT
                </button>
              </form>
           </div>
        </div>
      </nav>

      {/* The Console Area */}
      <div className="p-6">
         <TypeZeroConsole /> 
      </div>
    </div>
  );
}