import { useState, useMemo } from "react";
import { Search, Loader2 } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import UserCard from "./UserCard";

const ROLE_TABS = [
  { id: "todos",      label: "Todos"       },
  { id: "user",       label: "Ciudadano"   },
  { id: "admin",      label: "Admin"       },
  { id: "superAdmin", label: "Super Admin" },
];

export default function AdminUsuariosTab() {
  const { users, roles, loading, loadError, actionLoading, actionError, handleRoleChange, handleBanToggle } = useUsers();
  const [searchTerm, setSearchTerm]       = useState("");
  const [activeRoleTab, setActiveRoleTab] = useState("todos");

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const name  = `${u.firstName ?? ""} ${u.lastName ?? ""}`.toLowerCase();
      const email = (u.email ?? "").toLowerCase();
      const q     = searchTerm.toLowerCase();
      return (name.includes(q) || email.includes(q)) &&
             (activeRoleTab === "todos" || u.role?.name === activeRoleTab);
    });
  }, [users, searchTerm, activeRoleTab]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 p-6 bg-[#F8F9FF] min-h-screen">

      {/* Header + buscador */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-5 rounded-[24px] shadow-sm border border-blanquito/30">
        <h2 className="text-xl font-bold text-azul-oscuro shrink-0">Gestión de Usuarios</h2>
        <div className="relative w-full md:w-80 shrink-0">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar nombre o correo..."
            className="w-full pl-8 pr-4 py-2.5 bg-blanquito/40 rounded-xl text-azul-oscuro placeholder-celestito/60 focus:outline-none focus:ring-2 focus:ring-celestito transition-all border-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs de roles */}
      <div className="bg-white px-2 rounded-xl shadow-sm border border-blanquito/30 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {ROLE_TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveRoleTab(id)}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                activeRoleTab === id
                  ? "border-azul-oscuro text-azul-oscuro"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={24} className="animate-spin text-celestito" />
        </div>
      ) : loadError ? (
        <div className="flex justify-center py-16">
          <p className="text-sm text-red-500 font-medium">{loadError}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {filteredUsers.length > 0 ? filteredUsers.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              roles={roles}
              isLoading={actionLoading[user._id]}
              error={actionError[user._id]}
              onRoleChange={handleRoleChange}
              onBanToggle={handleBanToggle}
            />
          )) : (
            <div className="col-span-full py-10 text-center text-celestito font-medium bg-white rounded-[24px] border border-blanquito/30">
              No se encontraron usuarios.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
