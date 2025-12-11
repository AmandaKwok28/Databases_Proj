import { Button, Flex, Text } from "@chakra-ui/react"
import VisualizationControls from "./visualizationControls";
import { useStore } from "@nanostores/react";
import { $chartType, $groupBy, $includeNulls, $topN, $xAxis, $yAxis, setChartData } from "@/lib/store";
import { fetchData } from "@/api/api";
import type { ChartData } from "@/api/types";
import { toaster } from "../ui/toaster";

function mergeChartResults(results: ChartData[]) {
  const merged = new Map<string, any>();

  results.forEach((result, metricIndex) => {
    result.data.forEach((row) => {
      const key = row.x;

      if (!merged.has(key)) {
        merged.set(key, { x: key, y: [] as number[] });
      }

      const entry = merged.get(key);

      // Ensure correct array length
      if (!entry.y[metricIndex]) {
        entry.y[metricIndex] = Number(row.y);
      }
    });
  });

  return {
    data: Array.from(merged.values()),
    xLabel: results[0].xLabel,
    yLabel: results.map((r) => r.yLabel), // flatten incoming yLabels
    groupLabel: results[0].groupLabel
  };
}


function filterNulls(data: any[], includeNulls: boolean) {
  if (includeNulls) return data;

  return data.filter(row => {
    // Always remove x = "?"
    if (row.x === "?" || row.x === "No Affiliation Provided") return false;

    // If grouped, remove rows where group_value = "?"
    if (row.group_value === "?") return false;

    return true;
  });
}



const SideBar = () => {

    const x = useStore($xAxis);
    const y = useStore($yAxis);
    const chartType = useStore($chartType);
    const groupBy = useStore($groupBy);
    const topN = useStore($topN);
    const includeNulls = useStore($includeNulls);

    const handleSubmit = async () => {
        if (!x || !y || y.length === 0) {
            toaster.error({
            title: "Select Mandatory Fields",
            description: "Please select the X and Y Axes options",
            });
            return;
        }

        console.log('groupby: ', groupBy)

        const isGrouped = groupBy !== "none";
        const isMultiMetric = y.length > 1;

        // Prevent illegal combination
        if (isGrouped && isMultiMetric) {
            toaster.error({
            title: "Invalid Selection",
            description: "Grouping is only supported with one metric at a time.",
            });
            return;
        }

        // ----- MULTI-METRIC (ONLY allowed when NOT grouped) -----
        if (isMultiMetric) {
            const results: ChartData[] = await Promise.all(
                y.map((metric) => fetchData(x, metric, groupBy ?? "none", topN))
            );

            const merged = mergeChartResults(results);

            setChartData({
                data: filterNulls(merged.data, includeNulls),
                xLabel: merged.xLabel,
                yLabel: merged.yLabel,
                groupLabel: merged.groupLabel,
                chartType
            });
            return;
        }

        // ----- SINGLE METRIC (works grouped or not) -----
        const res: ChartData = await fetchData(x, y[0], groupBy ?? "none", topN);

        setChartData({
            data: filterNulls(res.data, includeNulls),
            xLabel: res.xLabel,
            yLabel: [y[0]],
            groupLabel: res.groupLabel,
            chartType
        });
    };


    
    return (
        <Flex
            w='1/4'
            h='full'
            p='10'
        >
            <Flex
                w='full'
                h='full'
                rounded='lg'
                border='2px solid black'
                p='4'
                direction='column'
                gap={4}
                overflowY='auto'
            >

                <Text w='full' textAlign='center' fontWeight='bold' fontSize='xl'> 
                    Visualization 
                </Text>

                <VisualizationControls />

                {/* Submission */}
                <Flex w='full' justify='center' mt={'12'} mb={'24'}>
                    <Button variant='subtle' onClick={handleSubmit}>
                        Submit
                    </Button>
                </Flex>
                
            </Flex>
        </Flex>
    )
}

export default SideBar;