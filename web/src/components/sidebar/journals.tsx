import { createListCollection, Flex, Portal, Select, Text } from "@chakra-ui/react"

const Journals = () => {

    const journals = createListCollection({
        items: [
            { label: "Nature", value: "nature" },
            { label: "Science", value: "science" },
            { label: "IEEE", value: "ieee" },
        ],
    });

    return (
        <Flex direction='column'>
            <Text mb={2} fontWeight='semibold'>Journals</Text>
            <Select.Root collection={journals}>
                <Select.Trigger>
                    <Select.ValueText placeholder="Select a journal" />
                </Select.Trigger>
                <Portal>
                    <Select.Positioner>
                        <Select.Content>
                            {journals.items.map((item) => (
                                <Select.Item key={item.value} item={item}>
                                    {item.label}
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Portal>
            </Select.Root>
        </Flex>
    )
}

export default Journals;