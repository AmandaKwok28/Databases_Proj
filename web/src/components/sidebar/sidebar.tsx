import { Button, Flex, Text } from "@chakra-ui/react"
// import YearSlider from "./yearSlider";
// import TagBox from "./tagBox";
import VisualizationControls from "./visualizationControls";
//import Journals from "./journals";
import { useStore } from "@nanostores/react";
import { $chartType, $groupBy, $xAxis, $yAxis, setChartData } from "@/lib/store";
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





const SideBar = () => {

    const x = useStore($xAxis);
    const y = useStore($yAxis);
    const chartType = useStore($chartType);
    const groupBy = useStore($groupBy);

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
            y.map((metric) => fetchData(x, metric, groupBy ?? "none"))
            );

            const merged = mergeChartResults(results);

            setChartData({
            data: merged.data,
            xLabel: merged.xLabel,
            yLabel: merged.yLabel,
            groupLabel: merged.groupLabel,
            chartType,
            });
            return;
        }

        // ----- SINGLE METRIC (works grouped or not) -----
        const res: ChartData = await fetchData(x, y[0], groupBy ?? "none");

        setChartData({
            data: res.data,
            xLabel: res.xLabel,
            yLabel: [y[0]],
            groupLabel: res.groupLabel,
            chartType,
        });
    };


    
    return (
        <Flex
            w='1/3'
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
                

                {/* <Text w='full' textAlign='center' fontWeight='bold' fontSize='xl'> 
                    Data Filters 
                </Text>

                <Journals />

                <Flex w='full' direction='column'>
                    <Text mb={4} fontWeight='semibold'> Year Range </Text>
                    <YearSlider />
                </Flex>

                <Flex w='full' direction='column' gap={4}>
                    <TagBox placeholder="Countries (e.g., USA, China)" />
                    <TagBox placeholder="Keywords/Categories" />
                    <TagBox placeholder="Institutions" />
                    <TagBox placeholder="Gender (M, F, Unknown)" />
                    <TagBox placeholder="Ethnicity" />
                </Flex>

                <Flex w='full' h='1px' bg='gray.300' my={4} /> */}
                
            </Flex>
        </Flex>
    )
}

export default SideBar;