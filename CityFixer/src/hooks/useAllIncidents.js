import { useState, useEffect, useCallback } from "react";
import { getAllIncidents } from "@/services/api";

export function useAllIncidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getAllIncidents();
      setIncidents(data.incidents ?? []);
    } catch {
      setIncidents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { incidents, loading, refresh };
}
