import { Flex, Slider, Text } from "@chakra-ui/react"
import { useState } from "react"

const YearSlider = () => {
    const years = [
        2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017,
        2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025
    ];

    const [sliderValues, setSliderValues] = useState([0, years.length - 1]);

    return (
        <Flex direction='column' gap={3}>
            <Flex justify='space-between' align='center'>
                <Flex 
                    bg='blue.100' 
                    px={3} 
                    py={1} 
                    rounded='md'
                    fontSize='sm'
                    fontWeight='semibold'
                    color='blue.800'
                >
                    {years[sliderValues[0]]}
                </Flex>
                <Text fontSize='sm' color='gray.500'>to</Text>
                <Flex 
                    bg='blue.100' 
                    px={3} 
                    py={1} 
                    rounded='md'
                    fontSize='sm'
                    fontWeight='semibold'
                    color='blue.800'
                >
                    {years[sliderValues[1]]}
                </Flex>
            </Flex>

            <Slider.Root 
                width="full" 
                defaultValue={[0, years.length - 1]}
                min={0}
                max={years.length - 1}
                step={1}
                colorPalette='blue'
                onValueChange={(details) => setSliderValues(details.value)}
            >
                <Slider.Control>
                    <Slider.Track>
                        <Slider.Range />
                    </Slider.Track>
                    <Slider.Thumb index={0} />
                    <Slider.Thumb index={1} />
                </Slider.Control>
            </Slider.Root>
        </Flex>
    )
}

export default YearSlider;