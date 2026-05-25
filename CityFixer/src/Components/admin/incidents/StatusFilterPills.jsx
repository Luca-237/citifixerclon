import { STATUS_STYLES, STATUS_LABELS, STATUS_KEYS } from "@/lib/incidents";

const FILTERS = [
  { key: "todos", label: "Todos" },
  { key: STATUS_KEYS.PENDING,    label: STATUS_LABELS[STATUS_KEYS.PENDING]    },
  { key: STATUS_KEYS.IN_PROCESS, label: STATUS_LABELS[STATUS_KEYS.IN_PROCESS] },
  { key: STATUS_KEYS.RESOLVED,   label: STATUS_LABELS[STATUS_KEYS.RESOLVED]   },
  { key: STATUS_KEYS.REJECTED,   label: STATUS_LABELS[STATUS_KEYS.REJECTED]   },
];

export default function StatusFilterPills({ active, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {FILTERS.map(({ key, label }) => {
        const isActive = active === key;
        const style = STATUS_STYLES[key];

        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
              isActive
                ? key === "todos"
                  ? "bg-[#292D60] text-white"
                  : `${style.bg} ${style.text}`
                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
