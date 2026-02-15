import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import TypeZeroConsole from "@/components/dashboard/TypeZeroConsole"; // Import the new component

export default async function Dashboard() {
  const session = await auth();
  if (!session) redirect("/");

  return (
    <div className="min-h-screen bg-[#020202] text-white overflow-hidden">
      
      {/* Dashboard Nav (Minimal) */}
      <nav className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-obsidian">
        <div className="flex items-center gap-2">
             <div className="w-6 h-6 bg-sage rounded-sm flex items-center justify-center text-black font-black text-[10px]">T0</div>
             <span className="font-bold tracking-tight text-sm">Console</span>
        </div>
        
        <div className="flex items-center gap-4">
           {/* User Profile */}
           <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="text-right hidden md:block">
                 <div className="text-xs font-bold text-white">{session.user?.name}</div>
              </div>
              {session.user?.image && (
                 <Image 
                   src={session.user.image} 
                   alt="Profile" 
                   width={28} 
                   height={28} 
                   className="rounded-full border border-white/20"
                 />
              )}
              {/* Sign Out Button */}
              <form action={async () => { "use server"; await signOut(); }}>
                <button className="text-[10px] font-bold tracking-widest text-gray-500 hover:text-white ml-2 uppercase">Logout</button>
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