import { useStore } from '@nanostores/react';
import { Flex } from "@chakra-ui/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { $chartData } from '@/lib/store';


const BarGraph = () => {
  const chartData = useStore($chartData);

  if (!chartData || chartData.length === 0) {
    return <Flex p={10}>No data available</Flex>;
  }

  return (
    <Flex w="full" p={10}>
      <BarChart
        width={800}
        height={400}
        data={chartData}
        margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="5 5" />
        <XAxis dataKey="x" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="y" fill="purple" name="Value" />
      </BarChart>
    </Flex>
  );
};

export default BarGraph;
