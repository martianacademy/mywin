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
import { CardContainer } from "../../../../../components";
import { useSupportedNetworkInfo } from "../../../../../constants";
import { userIDAccountType } from "../../../../../hooks/ReferralHooks";

const MotionCircularProgress = motion(CircularProgress);

export const LimitToExceed = ({
  idAccountMap,
}: {
  idAccountMap: userIDAccountType;
}) => {
  const { chainId } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  const limitPercentage =
    (idAccountMap?.limitBalanceUSD / idAccountMap?.maxLimitAmount) * 100;
  return (
    <CardContainer>
      <Heading size="sm">Limit Reached</Heading>
      <CircularProgress
        size={200}
        thickness="15px"
        color="orange.500"
        value={limitPercentage > 0 ? limitPercentage : 0}
      >
        <CircularProgressLabel>
          {limitPercentage > 0 ? limitPercentage : 0}%
        </CircularProgressLabel>
      </CircularProgress>
      <VStack w="full">
        <Tag colorScheme="green">ROI Limit</Tag>
        <Heading size="sm" fontStyle="oblique" fontWeight="semibold">
          {idAccountMap?.maxLimitAmount} {currentNetwork?.MYUSD?.Symbol}
        </Heading>
      </VStack>
      <VStack w="full">
        <Tag colorScheme="green">Referral Limit</Tag>
        <Heading size="sm" fontStyle="oblique" fontWeight="semibold">
          {idAccountMap?.maxLimitAmount} {currentNetwork?.MYUSD?.Symbol}
        </Heading>
      </VStack>
      <VStack w="full">
        <Tag colorScheme="red">Limit Reached</Tag>
        <Heading size="sm" fontStyle="oblique" fontWeight="semibold">
          {idAccountMap?.limitBalanceUSD} {currentNetwork?.MYUSD?.Symbol}
        </Heading>
      </VStack>
    </CardContainer>
  );
};
