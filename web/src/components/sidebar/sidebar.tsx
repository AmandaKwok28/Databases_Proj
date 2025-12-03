import { Button, Flex, Text } from "@chakra-ui/react"
import YearSlider from "./yearSlider";
import TagBox from "./tagBox";
import VisualizationControls from "./visualizationControls";
import Journals from "./journals";


const SideBar = () => {
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

                <Flex w='full' h='1px' bg='gray.300' my={4} />

                <Text w='full' textAlign='center' fontWeight='bold' fontSize='xl'> 
                    Visualization 
                </Text>

                <VisualizationControls />

                {/* Submission */}
                <Flex w='full' justify='center' mt={'12'} mb={'24'}>
                    <Button variant='subtle'>
                        Submit
                    </Button>
                </Flex>
                
            </Flex>
        </Flex>
    )
}

export default SideBar;