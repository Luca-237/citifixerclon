import { useState } from "react";
import { useClerk } from "@clerk/clerk-react";
import IncidentModal from "../Components/map/IncidentModal";
import { Button } from "@/components/ui/button";
import MapPicker from "@/Components/map/MapPicker";

function Home() {
  const { signOut } = useClerk();
  const [ubicacion, setUbicacion] = useState(null);

  return (
    <div className="p-4 flex flex-col gap-4">
      <h1>Dashboard ciudadano</h1>

      <MapPicker onChange={setUbicacion} />

      {ubicacion && (
        <p className="text-sm text-muted-foreground">
          📍 {ubicacion.calle} {ubicacion.numero}, {ubicacion.barrio},{" "}
          {ubicacion.ciudad}
        </p>
      )}

      <IncidentModal />

      <Button variant="outline" onClick={() => signOut()}>
        Cerrar sesión
      </Button>
    </div>
  );
}

export default Home;
