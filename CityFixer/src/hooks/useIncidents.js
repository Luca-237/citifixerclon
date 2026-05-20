import { useState, useEffect, useCallback } from "react";
import { getMisIncidentes } from "@/services/api";

export function useIncidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getMisIncidentes();
      setIncidents(data.incidents ?? []);
    } catch {
      setIncidents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { incidents, loading, refresh };
}
