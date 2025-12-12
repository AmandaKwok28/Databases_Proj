import { Button, Checkbox, Flex, Input, Text } from "@chakra-ui/react"
import { useState } from "react";
import { toaster } from "../ui/toaster";
import { $includeNulls, setFilters, setIncludeNulls, setTopN } from "@/lib/store";
import { useStore } from "@nanostores/react";

const Filter = () => {

    const [N, setN] = useState<string>("5");
    const toggle = useStore($includeNulls);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (value === "") {
            setN("");
            return;
        }

        if (isNaN(Number(value))) {
            toaster.error({
                title: "Format",
                description: "Please enter an integer value",
            })
            return;
        } 

        setN(value);
        setTopN(Number(value));
        
    };


    return (
        <Flex w='1/4' h='full' mr={10} justify='center' align='center'>
            <Flex w='full' h='2/3' border='2px solid black' rounded='lg' align={'center'} direction={'column'} p={4}>
                <Text fontSize={'xl'} fontWeight={'bold'}> Filter(s) </Text>

                {/* Filters: topX, exclude '?' */}
                <Flex direction={'column'} w={'full'} mt={4}>
                    <Text fontSize={'md'} fontWeight={'bold'}> Top N </Text>
                    <Text fontSize={'sm'} color={'gray.500'} lineHeight={'shorter'} mb={2}> Automatically filtered for top 5 most prevalent results </Text>
                    <Input 
                        placeholder="Enter an integer"
                        value={N}
                        onChange={(e) => handleChange(e)}
                        mb={4}
                    />

                    <Text fontSize={'md'} fontWeight={'bold'}> Include '?' </Text>
                    <Text fontSize={'sm'} color={'gray.500'} lineHeight={'shorter'} mb={2}> 
                        Due to data restrictions, results may contain many unknowns. To filter nulls out, toggle the following
                    </Text>
                    <Checkbox.Root
                        checked={toggle}
                        onCheckedChange={() => {
                            setIncludeNulls(!toggle);
                        }}
                    >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control>
                            <Checkbox.Indicator />
                        </Checkbox.Control>
                        <Checkbox.Label> Include nulls (?) </Checkbox.Label>
                    </Checkbox.Root>
                </Flex>

                <Button mt={10} variant={'subtle'} onClick={setFilters}>
                    Apply Filters
                </Button>
            </Flex>
        </Flex>
    )
}

export default Filter;