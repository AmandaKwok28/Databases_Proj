import { Flex, Text } from "@chakra-ui/react"
import { createListCollection, Select } from "@chakra-ui/react"

const VisualizationControls = () => {
    const chartTypes = createListCollection({
        items: [
            { label: "Bar Chart", value: "bar" },
            { label: "Line Chart", value: "line" },
            { label: "Scatter Plot", value: "scatter" },
            { label: "Histogram", value: "histogram" },
            { label: "Pie Chart", value: "pie" },
        ],
    });

    const xAxisOptions = createListCollection({
        items: [
            { label: "Year", value: "year" },
            { label: "Journal", value: "journal" },
            { label: "Country", value: "country" },
            { label: "Institution", value: "institution" },
            { label: "Category", value: "category" },
            { label: "Gender", value: "gender" },
            { label: "Ethnicity", value: "ethnicity" },
        ],
    });

    const yAxisOptions = createListCollection({
        items: [
            { label: "Publication Count", value: "publication_count" },
            { label: "Citation Count", value: "citation_count" },
            { label: "Author Count", value: "author_count" },
            { label: "Percentage", value: "percentage" },
            { label: "Impact Factor", value: "impact_factor" },
        ],
    });

    const groupByOptions = createListCollection({
        items: [
            { label: "None", value: "none" },
            { label: "Gender", value: "gender" },
            { label: "Country", value: "country" },
            { label: "Journal", value: "journal" },
            { label: "Ethnicity", value: "ethnicity" },
        ],
    });

    return (
        <Flex direction='column' gap={4}>
            <Flex direction='column'>
                <Text mb={2} fontWeight='semibold'>
                    Chart Type <Text as='span' color='red.500'>*</Text>
                </Text>
                <Select.Root collection={chartTypes}>
                    <Select.Trigger>
                        <Select.ValueText placeholder="Select chart type" />
                    </Select.Trigger>
                    <Select.Content>
                        {chartTypes.items.map((item) => (
                            <Select.Item key={item.value} item={item} color='white'>
                                {item.label}
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Root>
            </Flex>

            <Flex direction='column'>
                <Text mb={2} fontWeight='semibold'>
                    X-Axis <Text as='span' color='red.500'>*</Text>
                </Text>
                <Select.Root collection={xAxisOptions}>
                    <Select.Trigger>
                        <Select.ValueText placeholder="Select X-axis" />
                    </Select.Trigger>
                    <Select.Content>
                        {xAxisOptions.items.map((item) => (
                            <Select.Item key={item.value} item={item} color='white'>
                                {item.label}
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Root>
            </Flex>

            <Flex direction='column'>
                <Text mb={2} fontWeight='semibold'>
                    Y-Axis <Text as='span' color='red.500'>*</Text>
                </Text>
                <Select.Root collection={yAxisOptions}>
                    <Select.Trigger>
                        <Select.ValueText placeholder="Select Y-axis" />
                    </Select.Trigger>
                    <Select.Content>
                        {yAxisOptions.items.map((item) => (
                            <Select.Item key={item.value} item={item} color='white'>
                                {item.label}
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Root>
            </Flex>

            <Flex direction='column'>
                <Text mb={2} fontWeight='semibold'> Group By </Text>
                <Select.Root collection={groupByOptions}>
                    <Select.Trigger>
                        <Select.ValueText placeholder="None" />
                    </Select.Trigger>
                    <Select.Content>
                        {groupByOptions.items.map((item) => (
                            <Select.Item key={item.value} item={item} color='white'>
                                {item.label}
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Root>
            </Flex>
        </Flex>
    )
}

export default VisualizationControls;