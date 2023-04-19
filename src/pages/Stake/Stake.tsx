import { VStack } from "@chakra-ui/react";
import { useEthers, useConfig } from "@usedapp/core";
import React from "react";
import { StakingUI } from "../../components";

export const Stake = () => {
  const { account, chainId } = useEthers();
  const config = useConfig();
  console.log(config);
  return (
    <VStack w="full" flex={1} py={50}>
      <StakingUI />
    </VStack>
  );
};
