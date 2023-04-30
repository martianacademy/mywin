import {
  CircularProgress,
  CircularProgressLabel,
  Heading,
  HStack,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { motion } from "framer-motion";
import React from "react";
import { useSupportedNetworkInfo } from "../../constants";
import { userIDAccountType } from "../../hooks/ReferralHooks";
import { CardContainer } from "../UI";

export const LimitToExceedComponent = ({
  idAccountMap,
}: {
  idAccountMap: userIDAccountType;
}) => {
  const { chainId } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  const limitPercentage =
    (idAccountMap?.totalIncome / idAccountMap?.totalMaxLimitAmount) * 100;
  return (
    <CardContainer>
      <Heading size="sm">Limit Reached</Heading>
      <CircularProgress
        size={200}
        thickness="15px"
        color={idAccountMap?.isActive ? "orange.500" : "red"}
        value={
          limitPercentage > 0
            ? limitPercentage
            : !idAccountMap?.isActive
            ? 100
            : 0
        }
      >
        {!idAccountMap?.isActive ? (
          <CircularProgressLabel color="red" fontSize="md" fontWeight={900}>
            Limit Reached
          </CircularProgressLabel>
        ) : (
          <CircularProgressLabel>
            {limitPercentage > 0 ? limitPercentage.toFixed(0) : 0}%
          </CircularProgressLabel>
        )}
      </CircularProgress>

      <VStack w="full">
        <Tag colorScheme="green">Max Limit</Tag>
        <Heading size="sm" fontStyle="oblique" fontWeight="semibold">
          {idAccountMap?.totalMaxLimitAmount} {currentNetwork?.MYUSD?.Symbol}
        </Heading>
      </VStack>
      {/* <VStack w="full">
          <Tag colorScheme="green">Referral Limit</Tag>
          <Heading size="sm" fontStyle="oblique" fontWeight="semibold">
            {idAccountMap?.maxLimitAmount} {currentNetwork?.MYUSD?.Symbol}
          </Heading>
        </VStack> */}
      <VStack w="full">
        <Tag colorScheme="red">Limit Reached</Tag>
        <Heading size="sm" fontStyle="oblique" fontWeight="semibold">
          {idAccountMap?.totalIncome} {currentNetwork?.MYUSD?.Symbol}
        </Heading>
      </VStack>
    </CardContainer>
  );
};
