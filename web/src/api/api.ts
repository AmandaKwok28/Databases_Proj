import { API_URL } from "@/env";
import type { GroupField, XField, YField } from "./types";

// endpoint for visualization
export const fetchData = async (
    x: XField,
    y: YField,
    groupBy: GroupField,
    topN: number
) => {
  const response = await fetch(`${API_URL}/visualize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      x,
      y,
      groupBy,
      N: topN,
    }),
  });
  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
  const { data, xLabel, yLabel, groupLabel } = await response.json();
  return {
    data,
    xLabel,
    yLabel,
    groupLabel
  };
};


