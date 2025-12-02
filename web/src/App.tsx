import { Flex } from "@chakra-ui/react";
import SideBar from "./components/sidebar/sidebar";

function App() {
  return (
    <Flex 
      bg='white'
      w='100vw'
      h='100vh'
      overflow='none'
      color='black'
    >
      <SideBar />
    </Flex>
  );
}

export default App;