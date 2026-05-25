import { useUser, useClerk } from "@clerk/clerk-react";
import { LogOut } from "lucide-react";

export default function AdminHeader() {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <header className="bg-[#292D60] px-5 py-3 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-white font-bold text-lg tracking-tight">CityFixer</span>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white/70 uppercase tracking-wider">
          Admin
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-white/70 hidden sm:block">
          {user?.fullName ?? "Administrador"}
        </span>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors"
        >
          <LogOut size={15} />
          <span className="hidden sm:block">Salir</span>
        </button>
      </div>
    </header>
  );
}
