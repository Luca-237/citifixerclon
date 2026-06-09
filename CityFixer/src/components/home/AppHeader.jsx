import { useState } from "react";
import { LogOut, Siren, ShieldOff, User, Home as HomeIcon, FileText, HelpCircle, Mail, Phone, MessageCircle, Clock, Bell, CheckCheck } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UrgenciasModal from "./UrgenciasModal";
import { useNotificationContext } from "@/context/NotificationContext";

const DESKTOP_TABS = [
  { id: "inicio",   label: "Inicio",       icon: HomeIcon },
  { id: "reportes", label: "Mis Reportes", icon: FileText },
];

// ── Tiempo relativo ──────────────────────────────────────────────────────────
function relativeTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)  return "ahora";
  if (mins < 60) return `hace ${mins} min`;
  if (hours < 24) return `hace ${hours} h`;
  return `hace ${days} d`;
}

// ── Panel de notificaciones ───────────────────────────────────────────────────
function NotificationPanel({ onNavigate }) {
  const ctx = useNotificationContext();
  if (!ctx) return null;

  const { notifications, unreadCount, markAllRead } = ctx;

  return (
    <div className="flex flex-col" style={{ maxHeight: "420px" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 shrink-0">
        <p className="text-sm font-semibold text-slate-900">Notificaciones</p>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-celestito transition-colors"
          >
            <CheckCheck size={12} />
            Marcar todas
          </button>
        )}
      </div>

      {/* Lista */}
      <div className="overflow-y-auto [&::-webkit-scrollbar]:hidden flex-1">
        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <Bell size={20} className="text-slate-200 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-500">Sin notificaciones</p>
            <p className="text-xs text-slate-400 mt-0.5">Te avisaremos cuando haya novedades.</p>
          </div>
        ) : (
          notifications.map((noti) => (
            <button
              key={noti._id}
              onClick={() => onNavigate(noti)}
              className={`w-full text-left px-4 py-3 border-b border-slate-100 last:border-0 transition-colors flex items-start gap-3 ${
                !noti.isRead ? "bg-blue-50 hover:bg-blue-100/70" : "hover:bg-slate-50"
              }`}
            >
              {/* Indicador no leída */}
              <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${!noti.isRead ? "bg-blue-500" : "bg-slate-200"}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-xs leading-snug ${!noti.isRead ? "font-semibold text-slate-900" : "font-normal text-slate-500"}`}>
                  {noti.message}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">{relativeTime(noti.createdAt)}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

// ── AppHeader principal ───────────────────────────────────────────────────────
export default function AppHeader({ user, isBanned, activeTab, onTabChange }) {
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [urgenciasOpen, setUrgenciasOpen] = useState(false);
  const [helpOpen, setHelpOpen]           = useState(false);
  const [notiOpen, setNotiOpen]           = useState(false);

  const ctx = useNotificationContext();
  const unreadCount = ctx?.unreadCount ?? 0;

  const handleNotiNavigate = (noti) => {
    setNotiOpen(false);
    ctx?.markByIncident(noti.incidentId);
    onTabChange?.("reportes");
  };

  return (
    <>
      <UrgenciasModal open={urgenciasOpen} onOpenChange={setUrgenciasOpen} />

      {/* Dialog de ayuda */}
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="max-w-xs p-0 overflow-hidden">
          <DialogHeader className="px-5 pt-5 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 shrink-0">
                <HelpCircle size={16} className="text-primary" />
              </div>
              <div>
                <DialogTitle className="text-sm font-semibold text-slate-900">Ayuda y soporte</DialogTitle>
                <p className="text-xs text-slate-400 mt-0.5">CityFixer</p>
              </div>
            </div>
          </DialogHeader>
          <div className="px-5 py-4 space-y-3">
            <a href="mailto:soporte@cityfixer.com" className="flex items-center gap-3 group">
              <div className="flex items-center justify-center w-7 h-7 rounded-md bg-slate-100 shrink-0 group-hover:bg-primary/10 transition-colors">
                <Mail size={13} className="text-slate-500 group-hover:text-primary transition-colors" />
              </div>
              <div>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Email</p>
                <p className="text-xs font-medium text-slate-700 group-hover:text-primary transition-colors">soporte@cityfixer.com</p>
              </div>
            </a>
            <a href="tel:+5493515551234" className="flex items-center gap-3 group">
              <div className="flex items-center justify-center w-7 h-7 rounded-md bg-slate-100 shrink-0 group-hover:bg-primary/10 transition-colors">
                <Phone size={13} className="text-slate-500 group-hover:text-primary transition-colors" />
              </div>
              <div>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Teléfono</p>
                <p className="text-xs font-medium text-slate-700 group-hover:text-primary transition-colors">+54 9 351 555-1234</p>
              </div>
            </a>
            <a href="https://wa.me/5493515555678" target="_blank" rel="noreferrer" className="flex items-center gap-3 group">
              <div className="flex items-center justify-center w-7 h-7 rounded-md bg-slate-100 shrink-0 group-hover:bg-emerald-50 transition-colors">
                <MessageCircle size={13} className="text-slate-500 group-hover:text-emerald-600 transition-colors" />
              </div>
              <div>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">WhatsApp</p>
                <p className="text-xs font-medium text-slate-700 group-hover:text-emerald-600 transition-colors">+54 9 351 555-5678</p>
              </div>
            </a>
          </div>
          <div className="mx-5 mb-4 flex items-start gap-3 bg-slate-50 rounded-lg px-3 py-2.5">
            <Clock size={13} className="text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Horario de atención</p>
              <p className="text-xs text-slate-600 font-medium">Lunes a Viernes</p>
              <p className="text-xs text-slate-500">08:00 a 18:00 hs</p>
            </div>
          </div>
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] text-slate-400">© 2026 CityFixer</span>
            <span className="text-[10px] text-slate-400">Versión 1.0.0</span>
          </div>
        </DialogContent>
      </Dialog>

      {isBanned && (
        <div className="bg-red-600 px-4 py-2.5 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-white">
            <ShieldOff size={15} className="shrink-0" />
            <p className="text-xs font-semibold">Tu cuenta ha sido suspendida. No podés realizar acciones.</p>
          </div>
          <button
            onClick={() => signOut(() => navigate("/login"))}
            className="shrink-0 text-xs font-bold text-white/80 hover:text-white underline underline-offset-2 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      )}

      <header className="bg-white border-b border-slate-100 px-5 h-14 flex items-center justify-between shrink-0 sticky top-0 z-40">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <img src="/logoCityFixer.svg" alt="CityFixer" className="h-7 w-auto" />
          <span className="text-base font-bold text-slate-900 tracking-tight">CityFixer</span>
        </div>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {DESKTOP_TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange?.(id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === id
                  ? "bg-primary/10 text-primary"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </nav>

        {/* Derecha: urgencias + campana + avatar */}
        <div className="flex items-center gap-2">

          {/* Urgencias */}
          <button
            onClick={() => setUrgenciasOpen(true)}
            className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold px-3 h-8 rounded-lg transition-colors"
          >
            <Siren size={13} />
            <span className="hidden sm:inline">Urgencias</span>
          </button>

          {/* Campana de notificaciones */}
          <DropdownMenu open={notiOpen} onOpenChange={setNotiOpen}>
            <DropdownMenuTrigger asChild>
              <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors focus:outline-none">
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-primary ring-2 ring-white flex items-center justify-center text-white text-[9px] font-bold leading-none">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-80 p-0 rounded-xl border border-slate-100 shadow-lg overflow-hidden"
            >
              <NotificationPanel onNavigate={handleNotiNavigate} />
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Avatar desktop */}
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none hidden md:block">
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt="avatar" className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center ring-2 ring-slate-100">
                  <User size={15} className="text-slate-500" />
                </div>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-xl">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-800 truncate">{user?.fullName ?? "Ciudadano"}</p>
                <p className="text-[11px] text-gray-400 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
              <DropdownMenuItem onClick={() => onTabChange?.("perfil")} className="gap-2 cursor-pointer text-sm mt-1">
                <User size={14} /> Mi Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setHelpOpen(true)} className="gap-2 cursor-pointer text-sm">
                <HelpCircle size={14} /> Ayuda y soporte
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => signOut(() => navigate("/login"))}
                className="text-red-500 focus:text-red-500 focus:bg-red-50 gap-2 cursor-pointer text-sm"
              >
                <LogOut size={14} /> Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </header>
    </>
  );
}
