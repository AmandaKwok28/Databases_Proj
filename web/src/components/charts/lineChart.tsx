import { useStore } from '@nanostores/react';
import { Flex } from "@chakra-ui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { $chartData, $chartType } from '@/lib/store';

const BarGraph = () => {
    const { data, xLabel, yLabel } = useStore($chartData);
    const chartType = useStore($chartType);

    if (!data || data.length === 0) {
      return <Flex p={10}>No data available</Flex>;
    }

    // Check if backend returned grouped values
    const hasGroups = data.some((d) => d.group_value != null);

    let chartData: any[] = [];
    let groups: string[] = [];

    if (hasGroups) {
      // --------- GROUP-BY MODE ---------
      const groupedByX = data.reduce((acc, item) => {
        if (!acc[item.x]) {
          acc[item.x] = { x: item.x };
        }
        if (item.group_value) {
          acc[item.x][item.group_value] = Number(item.y);
        }
        return acc;
      }, {} as Record<string, any>);

      chartData = Object.values(groupedByX);
      groups = [...new Set(data.map((d) => d.group_value))].filter(
        (g): g is string => g != null
      );

    } else {
      // --------- MULTI / SINGLE METRIC MODE ---------
      chartData = data.map((item) => {
        const row: any = { x: item.x };

        if (Array.isArray(item.y)) {
          // Multi-metric case
          item.y.forEach((value, index) => {
            const metricName = yLabel[index];
            if (metricName) row[metricName] = Number(value);
          });
        } else {
          // Single metric case
          row[yLabel[0]] = Number(item.y);
        }

        return row;
      });
    }

    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#a4de6c'];

    const ChartComponent = chartType === "line" ? LineChart : BarChart;
    const SeriesComponent = chartType === "line" ? Line : Bar;

    const axisLabel = yLabel.length === 1 ? yLabel[0] : yLabel.join(" + ");

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
              value: axisLabel,
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle" }
            }}
          />

          <Tooltip />
          <Legend />

          {/* ---------- GROUPED SERIES ---------- */}
          {hasGroups &&
            groups.map((group, index) => (
              <SeriesComponent
                key={group}
                dataKey={group}
                name={group}
                {...(chartType === "line"
                  ? { type: "monotone", stroke: colors[index % colors.length] }
                  : { fill: colors[index % colors.length] }
                )}
              />
            ))}

          {/* ---------- MULTI-METRIC SERIES ---------- */}
          {!hasGroups &&
            yLabel.length > 1 &&
            yLabel.map((metricName, index) => (
              <SeriesComponent
                key={metricName}
                dataKey={metricName}
                name={metricName}
                {...(chartType === "line"
                  ? { type: "monotone", stroke: colors[index % colors.length] }
                  : { fill: colors[index % colors.length] }
                )}
              />
            ))}

          {/* ---------- SINGLE-METRIC SERIES ---------- */}
          {!hasGroups &&
            yLabel.length === 1 && (
              <SeriesComponent
                dataKey={yLabel[0]}
                name={yLabel[0]}
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
