import { API_URL } from "@/env";
import type { GroupField, XField, YField } from "./types";

// endpoint for visualization
export const fetchData = async (
    x: XField,
    y: YField,
    groupBy: GroupField
) => {
  const response = await fetch(`${API_URL}/visualize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      x,
      y,
      groupBy,
    }),
  });
  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
  const { data } = await response.json();
  return data;
};


