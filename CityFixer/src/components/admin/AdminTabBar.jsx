import { LayoutList, BarChart2, Tag, Users } from "lucide-react";

const TABS = [
  { id: "incidentes",   label: "Incidentes",   icon: LayoutList },
  { id: "estadisticas", label: "Estadísticas",  icon: BarChart2  },
  { id: "categorias",   label: "Categorías",    icon: Tag,         superAdminOnly: true },
  { id: "usuarios",     label: "Usuarios",      icon: Users,       superAdminOnly: true },
];

export default function AdminTabBar({ activeTab, onTabChange, dbRole }) {
  // Filtramos las pestañas para mostrar solo las permitidas según el rol
  const visibleTabs = TABS.filter(tab => !tab.superAdminOnly || dbRole === "superAdmin");

  return (
    <nav className="bg-white border-b border-gray-100 shrink-0">
      <div className="max-w-6xl mx-auto flex">
        {visibleTabs.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex-1 md:flex-none flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-2 px-2 md:px-4 py-3 text-xs md:text-sm font-semibold border-b-2 transition-colors ${
                active
                  ? "border-azul-oscuro text-azul-oscuro"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon size={16} />
              <span className="text-[10px] md:text-sm">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}