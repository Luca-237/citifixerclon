import AdminIncidentCard from "./AdminIncidentCard";
import IncidentSkeleton from "@/components/home/IncidentSkeleton";
import { EmptyState } from "@/components/home/IncidentCard";

export default function AdminIncidentList({ incidents, loading, onUpdated }) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[0, 1, 2, 3, 4].map((i) => <IncidentSkeleton key={i} />)}
      </div>
    );
  }

  if (!incidents.length) {
    return <EmptyState message="No hay incidentes para mostrar." />;
  }

  return (
    <div className="flex flex-col gap-3">
      {incidents.map((inc) => (
        <AdminIncidentCard key={inc._id} incident={inc} onUpdated={onUpdated} />
      ))}
    </div>
  );
}
