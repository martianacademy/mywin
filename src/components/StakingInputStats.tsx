import { HStack, Tag, Text, VStack } from "@chakra-ui/react";
import { StakingInfo } from "../constants";

export const StakingStats = ({
  inputValue,
  currencySymbol,
}: {
  inputValue: number;
  currencySymbol: string;
}) => {
  return (
    <VStack w="full" p={5}>
      <HStack w="full" justify="space-between" fontSize="xs">
        <Text>Staking Amount</Text>
        <Text>
          {inputValue > 0 ? Number(inputValue).toFixed(3) : "-"}{" "}
          {currencySymbol}
        </Text>
      </HStack>
      <HStack w="full" justify="space-between" fontSize="xs">
        <Text>APY</Text>
        <Text>{StakingInfo?.rewardRate}%</Text>
      </HStack>
      <HStack w="full" justify="space-between" fontSize="xs">
        <Text>Duration</Text>
        <Text>{StakingInfo?.duration} Months</Text>
      </HStack>
      <Tag w="full">
        <HStack w="full" justify="space-between" fontWeight={900} fontSize="xs">
          <Text>You get</Text>
          <Text>
            {inputValue > 0
              ? Number(
                  Number(inputValue) +
                    Number((inputValue * StakingInfo?.rewardRate) / 100)
                ).toFixed(3)
              : "-"}{" "}
            {currencySymbol}
          </Text>
        </HStack>
      </Tag>
    </VStack>
  );
};
