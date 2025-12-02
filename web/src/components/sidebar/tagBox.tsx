import { Flex, Input, SimpleGrid, Text } from "@chakra-ui/react"
import { useState } from "react"

type Props = {
    placeholder: string
}

type Item = {
    name: string
}

const TagBox = ({ placeholder } : Props) => {

    const [items, setItems] = useState<Item[]>([]);
    const [inputValue, setInputValue] = useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            setItems([...items, { name: inputValue.trim() }]);
            setInputValue("");
        }
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    return (
        <Flex w='full' direction='column' gap={3}>
            <Input 
                w='full'
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <SimpleGrid w='full' columns={4} gap={2}>
                {items.map((item, i) => {
                    return (
                        <Flex 
                            border='1px solid black' 
                            rounded='md' 
                            key={i}
                            px={3}
                            py={2}
                            align='center'
                            justify='space-between'
                            gap={2}
                        >
                            <Text fontSize='sm'>{item.name}</Text>
                            <Text 
                                cursor='pointer' 
                                onClick={() => removeItem(i)}
                                fontWeight='bold'
                                fontSize='lg'
                                _hover={{ color: 'red.500' }}
                            >
                                ×
                            </Text>
                        </Flex>
                    )
                })} 
            </SimpleGrid>
        </Flex>
    )
}

export default TagBox;