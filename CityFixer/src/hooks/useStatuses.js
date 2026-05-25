import { useState, useEffect } from "react";
import { getStatuses } from "@/services/api";

export function useStatuses() {
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    getStatuses()
      .then(({ data }) => setStatuses(data.statuses ?? []))
      .catch(() => {});
  }, []);

  return { statuses };
}
