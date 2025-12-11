import { Flex } from "@chakra-ui/react";
import SideBar from "./components/sidebar/sidebar";
import LineGraph from "./components/charts/lineChart";
import { Toaster } from "@/components/ui/toaster";
import Filter from "./components/sidebar/filter";
import { useStore } from "@nanostores/react";
import { $chartData } from "./lib/store";


function App() {

  const chartData = useStore($chartData);

  return (
    <Flex 
      bg='white'
      w='100vw'
      h='100vh'
      overflow='none'
      color='black'
    >
      <Toaster />
      <SideBar />
      <Flex w='3/4' justify='center' align='center' direction='column'>
        <Flex w='full' direction='row'>
          <LineGraph />
          {chartData.data.length !== 0 && (
            <Filter />
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}

export default App;