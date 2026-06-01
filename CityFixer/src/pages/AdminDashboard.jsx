import { useState } from "react";
import { useAllIncidents } from "@/hooks/useAllIncidents";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminTabBar from "@/components/admin/AdminTabBar";
import AdminIncidentesTab from "@/components/admin/incidents/AdminIncidentesTab";
import AdminEstadisticasTab from "@/components/admin/stats/AdminEstadisticasTab";
import AdminCategoriasTab from "@/components/admin/categories/AdminCategoriasTab";
import IncidentModal from "@/components/map/IncidentModal";
import AdminUsuariosTab from "@/components/admin/usuarios/AdminUsuariosTab";

export default function AdminDashboard({ dbRole }) {
  const [activeTab, setActiveTab] = useState("incidentes");
  const [reportOpen, setReportOpen] = useState(false);
  const { incidents, loading, refresh } = useAllIncidents();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <AdminHeader dbRole={dbRole} />
      <AdminTabBar activeTab={activeTab} onTabChange={setActiveTab} dbRole={dbRole} />

 <main className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
        <div className="max-w-6xl mx-auto px-4 py-5">
          
          {/* Visible para admin y superAdmin */}
          {activeTab === "incidentes" && (
            <AdminIncidentesTab
              incidents={incidents}
              loading={loading}
              onUpdated={refresh}
              onNuevoReporte={() => setReportOpen(true)}
            />
          )}
          
          {/* Visible para admin y superAdmin */}
          {activeTab === "estadisticas" && (
            <AdminEstadisticasTab incidents={incidents} loading={loading} />
          )}
          
          {/* EXCLUSIVO SUPERADMIN: Categorías */}
          {activeTab === "categorias" && dbRole === "superAdmin" && (
            <AdminCategoriasTab dbRole={dbRole} />
          )}

          {/* EXCLUSIVO SUPERADMIN: Usuarios */}
          {activeTab === "usuarios" && dbRole === "superAdmin" && (
            <AdminUsuariosTab />
          )}

        </div>
      </main>

      <IncidentModal open={reportOpen} onOpenChange={setReportOpen} onCreated={refresh} />
    </div>
  );
}
