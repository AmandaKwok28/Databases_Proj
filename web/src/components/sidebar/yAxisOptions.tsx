import { Checkbox, Flex, Text } from "@chakra-ui/react";
import { $yAxis, setYAxis } from "@/lib/store";
import type { YField } from "@/api/types";
import { useStore } from "@nanostores/react";

const yAxisOptions = [
  { label: "Publication Count", value: "publication_count" as YField },
  { label: "Citation Count", value: "citation_count" as YField },
  { label: "Author Count", value: "author_count" as YField }
] as const;

export function YAxisSelector() {

  const yAxis = useStore($yAxis);

  const toggleMetric = (metric: YField) => {
    const currentLabels = yAxis;
    let updated: YField[];

    if (currentLabels.includes(metric)) {
      updated = currentLabels.filter((m: YField) => m !== metric);
    } else {
      updated = [...currentLabels, metric];
    }
    setYAxis(updated);
  };


  return (
    <Flex direction="column">
      <Text mb={2} fontWeight="semibold">
        Y-Axis <Text as="span" color="red.500">*</Text> 
      </Text>

      <Flex direction="column" gap={2} pl={2}>
        {yAxisOptions.map((opt, i) => (
          <Checkbox.Root
            key={i}
            onCheckedChange={() => {
              toggleMetric(opt.value);
            }}
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Label>{opt.label}</Checkbox.Label>
          </Checkbox.Root>
        ))}
      </Flex>
    </Flex>
  );
}