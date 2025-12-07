export type ChartType =
  | "bar"
  | "line"
  | "scatter"
  | "histogram";

export type XField =
  | "year"
  | "journal"
  | "country"
  | "institution"
  | "gender"
  | "ethnicity";

export type YField =
  | "publication_count"
  | "citation_count"
  | "author_count";

export type GroupField =
  | "none"
  | "gender"
  | "ethnicity";
  
export type ChartData = {
  data: dataObj[];
  xLabel: string;
  yLabel: string;
  groupLabel: string | null;
}

export type ChartPlot = ChartData & {
  chartType: ChartType;
};



export type dataObj = {
  group: any;
  x: string;
  group_value: string;
  y: string;
}