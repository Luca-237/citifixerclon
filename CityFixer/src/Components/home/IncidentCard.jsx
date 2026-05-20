import { MapPin, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { STATUS_STYLES, STATUS_LABELS, capitalize } from "@/lib/incidents";

export function formatDate(dateStr) {
  const date = new Date(dateStr);
  const diff = Math.floor((new Date() - date) / 86400000);
  if (diff === 0) return "Hoy";
  if (diff === 1) return "Ayer";
  if (diff < 7) return `Hace ${diff} días`;
  return date.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
}

export function EmptyState({ message = "No tenés reportes todavía.\n¡Reportá tu primer incidente!" }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <AlertTriangle size={40} strokeWidth={1.5} className="text-gray-200" />
      <p className="text-sm text-center text-gray-400 whitespace-pre-line">{message}</p>
    </div>
  );
}

export default function IncidentCard({ incident }) {
  const statusKey = incident.status?.name;
  const style     = STATUS_STYLES[statusKey] ?? STATUS_STYLES.pendiente;
  const label     = STATUS_LABELS[statusKey] ?? capitalize(statusKey);

  return (
    <Card className="rounded-2xl border-none shadow-sm">
      <CardContent className="p-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-[#292D60] text-sm leading-tight flex-1">{incident.title}</p>
          <span className={`text-[10px] font-semibold px-2 py-1 rounded-full shrink-0 ${style.bg} ${style.text}`}>
            {label}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <MapPin size={11} className="shrink-0" />
          <span className="truncate">{incident.location?.address ?? "—"}</span>
          <span className="mx-1 shrink-0">·</span>
          <span className="shrink-0">{formatDate(incident.createdAt)}</span>
        </div>
        <span className="self-start text-[10px] bg-[#D3D6FF]/50 text-[#2F347A] px-2 py-0.5 rounded-full font-medium">
          {capitalize(incident.category?.name)}
        </span>
      </CardContent>
    </Card>
  );
}
