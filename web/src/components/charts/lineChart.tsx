import { useStore } from '@nanostores/react';
import { Flex } from "@chakra-ui/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { $chartData, $chartType } from '@/lib/store';

const BarGraph = () => {
  const { data, xLabel, yLabel } = useStore($chartData);
  const chartType = useStore($chartType);

  if (!data || data.length === 0) {
    return <Flex p={10}>No data available</Flex>;
  }

  // Check if we have grouped data
  const hasGroups = data.some((d) => d.group_value != null);
  
  let chartData: any[];
  let groups: string[] = [];
  
  if (hasGroups) {
    const groupedByX = data.reduce((acc, item) => {
      if (!acc[item.x]) {
        acc[item.x] = { x: item.x };
      }
      if (item.group_value) {
        acc[item.x][item.group_value] = item.y;
      }
      return acc;
    }, {} as Record<string, any>);
    
    chartData = Object.values(groupedByX);
    groups = [...new Set(data.map((d) => d.group_value))].filter((g): g is string => g != null);
  } else {
    chartData = data;
  }
  
  const colors: string[] = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#a4de6c'];

  console.log(chartType)
  const ChartComponent = chartType === "line" ? LineChart : BarChart;
  const SeriesComponent = chartType === "line" ? Line : Bar;


  return (
    <Flex w="full" pr={10}>
      <ResponsiveContainer width="100%" height={600}>
        <ChartComponent
          data={chartData}
          margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis
            dataKey="x"
            tickMargin={10}  
            label={{
              value: xLabel,
              position: "bottom",
              offset: 40,     
              style: { textAnchor: "middle" }
            }}
          />
          <YAxis
            width={80}   
            tickMargin={10}
            label={{
              value: yLabel,
              angle: -90,
              position: "insideLeft",
              offset: 0,
              style: { textAnchor: "middle" }
            }}
          />
          <Tooltip />
          <Legend />

          {/* If grouped data exists, create a Bar for each group */}
          {hasGroups ? (
            groups.map((group, index) => (
              <SeriesComponent
                key={group}
                dataKey={group}
                name={group}

                // apply correct props depending on chart type
                {...(chartType === "line"
                  ? { type: "monotone", stroke: colors[index % colors.length] }
                  : { fill: colors[index % colors.length] }
                )}
              />
            ))
          ) : (
            <SeriesComponent
              dataKey="y"
              name={yLabel || "Value"}

              {...(chartType === "line"
                ? { type: "monotone", stroke: "#8884d8" }
                : { fill: "#8884d8" }
              )}
            />
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </Flex>
  );
};

export default BarGraph;