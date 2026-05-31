import { useState, useEffect } from "react";
import { History, ChevronDown, ChevronUp, Bot, UserCog, User } from "lucide-react";
import { getIncidentHistory } from "@/services/api";
import { STATUS_STYLES, STATUS_LABELS, capitalize } from "@/lib/incidents";

function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const SOURCE_CONFIG = {
  ai:    { label: "IA",     icon: Bot,     className: "bg-violet-100 text-violet-700" },
  admin: { label: "Admin",  icon: UserCog, className: "bg-blanquito/70 text-azul"     },
  user:  { label: "Usuario",icon: User,    className: "bg-gray-100 text-gray-600"     },
};

export default function StatusHistory({ incidentId }) {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || history !== null) return;
    setLoading(true);
    getIncidentHistory(incidentId)
      .then((res) => setHistory(res.data.incident?.statusHistory ?? []))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, [open, incidentId, history]);

  return (
    <section>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full group"
      >
        <span className="flex items-center gap-1.5">
          <History size={13} className="text-gray-400" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Historial de estados</span>
        </span>
        <span className="text-gray-400 group-hover:text-gray-600 transition-colors">
          {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </span>
      </button>

      {open && (
        <div className="mt-3">
          {loading && (
            <p className="text-xs text-gray-400 py-2">Cargando historial...</p>
          )}

          {!loading && (history === null || history.length === 0) && (
            <p className="text-xs text-gray-400 py-2">Este incidente no tiene historial de estados registrado.</p>
          )}

          {!loading && history?.length > 0 && (
            <ol className="relative border-l border-gray-200 ml-1.5 flex flex-col gap-4 py-1">
              {history.map((entry, i) => {
                const statusKey = entry.status?.name;
                const style = STATUS_STYLES[statusKey] ?? STATUS_STYLES.pendiente;
                const label = STATUS_LABELS[statusKey] ?? capitalize(statusKey);
                const src = SOURCE_CONFIG[entry.source] ?? SOURCE_CONFIG.admin;
                const SrcIcon = src.icon;
                const changedBy = entry.changedBy
                  ? [entry.changedBy.firstName, entry.changedBy.lastName].filter(Boolean).join(" ")
                  : null;

                return (
                  <li key={i} className="ml-4 pl-3">
                    <span className="absolute -left-1.5 mt-1 w-3 h-3 rounded-full bg-gray-200 border-2 border-white" />

                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                        {label}
                      </span>
                      <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${src.className}`}>
                        <SrcIcon size={10} />
                        {src.label}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 mt-1">
                      {formatDateTime(entry.changedAt)}
                      {changedBy && <span className="text-gray-500"> · {changedBy}</span>}
                    </p>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      )}
    </section>
  );
}
