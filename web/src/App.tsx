import { Flex, Text } from "@chakra-ui/react";
import SideBar from "./components/sidebar/sidebar";
import LineGraph from "./components/charts/lineChart";
import { Toaster } from "@/components/ui/toaster";


function App() {
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
      <Flex w='2/3' justify='center' align='center' direction='column'>
        <Text color='black' fontWeight='bold' fontSize='xl'> Example Graph </Text>
        <LineGraph />
      </Flex>
    </Flex>
  );
}

export default App;