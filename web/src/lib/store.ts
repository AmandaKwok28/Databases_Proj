import type { ChartPlot, ChartType, GroupField, XField, YField } from "@/api/types";
import { atom } from "nanostores";

export const $chartType = atom<ChartType | null>(null);
export function setChartType (type: ChartType) {
    $chartType.set(type);
}

export const $chartData = atom<ChartPlot>({
    data: [],
    xLabel: "",
    yLabel: [],
    groupLabel: "",
    chartType: "bar"
});
export function setChartData (data: any) {
    $chartData.set(data);
}


export const $xAxis = atom<XField | null>(null);
export function setXAxis (type: XField) {
    $xAxis.set(type);
}

export const $yAxis = atom<YField[]>([]);
export function setYAxis (type: YField[]) {
    $yAxis.set(type);
}

export const $groupBy = atom<GroupField>("none");
export function setGroupBy (type: GroupField) {
    $groupBy.set(type);
}

export const $topN = atom<number>(5);
export function setTopN (val: number) {
    $topN.set(val);
}

export const $includeNulls = atom<boolean>(true);
export function setIncludeNulls (toggle: boolean) {
    $includeNulls.set(toggle);
}


export const $applyFilter = atom<boolean>(true);
export function setFilters() {
    $applyFilter.set(!$applyFilter.get())
}