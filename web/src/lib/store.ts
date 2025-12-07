import type { ChartData, ChartType, GroupField, XField, YField } from "@/api/types";
import { atom } from "nanostores";

export const $chartType = atom<ChartType | null>(null);
export function setChartType (type: ChartType) {
    $chartType.set(type);
}

export const $chartData = atom<ChartData>({
    data: [],
    xLabel: "",
    yLabel: "",
    groupLabel: ""
});
export function setChartData (data: any) {
    $chartData.set(data);
}


export const $xAxis = atom<XField | null>(null);
export function setXAxis (type: XField) {
    $xAxis.set(type);
}

export const $yAxis = atom<YField | null>(null);
export function setYAxis (type: YField) {
    $yAxis.set(type);
}

export const $groupBy = atom<GroupField>("none");
export function setGroupBy (type: GroupField) {
    $groupBy.set(type);
}
