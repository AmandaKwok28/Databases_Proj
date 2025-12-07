export type ChartType =
  | "bar"
  | "line"
  | "scatter"
  | "histogram"
  | "pie";

export type XField =
  | "year"
  | "journal"
  | "country"
  | "institution"
  | "category"
  | "gender"
  | "ethnicity";

export type YField =
  | "publication_count"
  | "citation_count"
  | "author_count"
  | "percentage"
  | "impact_factor";

export type GroupField =
  | "none"
  | "gender"
  | "country"
  | "journal"
  | "ethnicity";
  
export type VisualizationResult = {
  chartType: ChartType | null;
  x: XField;
  y: YField;
  groupBy: GroupField;
  data: any[]; // If you want, I can type this too
}