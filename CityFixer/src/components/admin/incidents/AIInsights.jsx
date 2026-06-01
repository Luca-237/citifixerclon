import { Bot } from "lucide-react";
import { capitalize } from "@/lib/incidents";
import PriorityEditor from "./PriorityEditor";

export default function AIInsights({ incident, onUpdated }) {
  const priority = Math.min(Math.max(Math.round(incident.priority ?? 1), 1), 5);
  const hasAI    = incident.ai_justification || incident.ai_suggested_category;

  if (!hasAI) return null;

  return (
    <section className="rounded-2xl bg-violet-50 border border-violet-100 p-4 flex flex-col gap-4">

      <span className="flex items-center gap-1.5 text-xs font-semibold text-violet-500 uppercase tracking-wider">
        <Bot size={13} />
        Análisis IA
      </span>

      <PriorityEditor
        incidentId={incident._id}
        priority={priority}
        onUpdated={onUpdated}
      />

      <div className="flex flex-col gap-2 border-t border-violet-100 pt-3">
        {incident.ai_suggested_category && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Categoría sugerida</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
              {capitalize(incident.ai_suggested_category)}
            </span>
          </div>
        )}
        {incident.ai_justification && (
          <p className="text-xs text-gray-500 leading-relaxed italic">
            "{incident.ai_justification}"
          </p>
        )}
      </div>

    </section>
  );
}
