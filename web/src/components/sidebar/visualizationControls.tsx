import { Flex, Text } from "@chakra-ui/react";
import { createListCollection, Select } from "@chakra-ui/react";
import type { 
    ChartType, 
    XField,
    YField,
    GroupField
} from "@/api/types";
import { setChartType, setGroupBy, setXAxis, setYAxis } from "@/lib/store";
import { toaster } from "../ui/toaster";



const VisualizationControls = () => {

  // Dropdown option collections
  const chartTypes = createListCollection({
    items: [
      { label: "Bar Chart", value: "bar" },
      { label: "Line Chart", value: "line" },
    ] as { label: string; value: ChartType }[],
  });

  const xAxisOptions = createListCollection({
    items: [
      { label: "Year", value: "year" },
      { label: "Journal", value: "journal" },
      { label: "Country", value: "country" },
      { label: "Institution", value: "institution" },
      { label: "Gender", value: "gender" },
      { label: "Ethnicity", value: "ethnicity" },
    ] as { label: string; value: XField }[],
  });

  const yAxisOptions = createListCollection({
    items: [
      { label: "Publication Count", value: "publication_count" },
      { label: "Citation Count", value: "citation_count" },
      { label: "Author Count", value: "author_count" }
    ] as { label: string; value: YField }[],
  });

  const groupByOptions = createListCollection({
    items: [
      { label: "None", value: "none" },
      { label: "Gender", value: "gender" },
      { label: "Ethnicity", value: "ethnicity" },
    ] as { label: string; value: GroupField }[],
  });

  return (
    <Flex direction="column" gap={4}>
      
      {/* Chart Type */}
      <Flex direction="column">
        <Text mb={2} fontWeight="semibold">
          Chart Type <Text as="span" color="red.500">*</Text>
        </Text>
        <Select.Root
          collection={chartTypes}
          onValueChange={({ value }) => {
            const selected = value[0];     
            if (selected) {
              setChartType(selected as ChartType);
            };

            if (selected === "line") {
              toaster.warning({
                title: "Line Chart Warning",
                description: "This option is only meaningful for X-Axis = Year",
                action: {
                  label: "Undo",
                  onClick: () => console.log("Undo"),
                },
              })
            }

          }}

>
          <Select.Trigger>
            <Select.ValueText placeholder="Select chart type" />
          </Select.Trigger>
          <Select.Content>
            {chartTypes.items.map((item) => (
              <Select.Item key={item.value} item={item} color="white">
                {item.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Flex>

      {/* X Axis */}
      <Flex direction="column">
        <Text mb={2} fontWeight="semibold">
          X-Axis <Text as="span" color="red.500">*</Text>
        </Text>
        <Select.Root
          collection={xAxisOptions}
          onValueChange={(val) => {
            if (!val) return;
            setXAxis(val.value as unknown as XField)
          }}
        >
          <Select.Trigger>
            <Select.ValueText placeholder="Select X-axis" />
          </Select.Trigger>
          <Select.Content>
            {xAxisOptions.items.map((item) => (
              <Select.Item key={item.value} item={item} color="white">
                {item.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Flex>

      {/* Y Axis */}
      <Flex direction="column">
        <Text mb={2} fontWeight="semibold">
          Y-Axis <Text as="span" color="red.500">*</Text>
        </Text>
        <Select.Root
          collection={yAxisOptions}
          onValueChange={(val) => setYAxis(val.value as unknown as YField)}
        >
          <Select.Trigger>
            <Select.ValueText placeholder="Select Y-axis" />
          </Select.Trigger>
          <Select.Content>
            {yAxisOptions.items.map((item) => (
              <Select.Item key={item.value} item={item} color="white">
                {item.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Flex>

      {/* Group By */}
      <Flex direction="column">
        <Text mb={2} fontWeight="semibold">
          Group By
        </Text>
        <Select.Root
          collection={groupByOptions}
          onValueChange={(val) => setGroupBy(val.value as unknown as GroupField)}
        >
          <Select.Trigger>
            <Select.ValueText placeholder="None" />
          </Select.Trigger>
          <Select.Content>
            {groupByOptions.items.map((item) => (
              <Select.Item key={item.value} item={item} color="white">
                {item.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Flex>
    </Flex>
  );
};

export default VisualizationControls;
