import { Flex } from '@chakra-ui/react';
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts';

// #region Sample data
const data = [
  {
    name: 'Page A',
    uv: 400,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 300,
    pv: 4567,
    amt: 2400,
  },
  {
    name: 'Page C',
    uv: 320,
    pv: 1398,
    amt: 2400,
  },
  {
    name: 'Page D',
    uv: 200,
    pv: 9800,
    amt: 2400,
  },
  {
    name: 'Page E',
    uv: 278,
    pv: 3908,
    amt: 2400,
  },
  {
    name: 'Page F',
    uv: 189,
    pv: 4800,
    amt: 2400,
  },
];

// #endregion
const LineGraph = () => {
  return (
    <Flex
        w='full'
        p={10}
    >
        <LineChart
            style={{ width: '100%', aspectRatio: 1.618 }}
            responsive
            data={data}
            margin={{
                top: 20,
                right: 20,
                bottom: 5,
                left: 0,
            }}
        >
            <CartesianGrid stroke="#aaa" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="uv" stroke="purple" strokeWidth={2} name="My motivation to attend class" />
            <XAxis 
                dataKey="name" 
                label={{ value: 'Publications', position: 'insideBottom', offset: -10 }}
            />
            <YAxis width="auto" label={{ value: 'UV', position: 'insideLeft', angle: -90 }} />
            <Legend align="right" />
        </LineChart>
    </Flex>
  );
}

export default LineGraph;