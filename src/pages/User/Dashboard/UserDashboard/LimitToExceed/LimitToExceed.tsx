import {
  CircularProgress,
  CircularProgressLabel,
  Heading,
  HStack,
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
      <Heading size="sm">Remaining Limit</Heading>
      <MotionCircularProgress
        size={200}
        thickness="15px"
        value={limitPercentage > 0 ? limitPercentage : 0}
        color="pink.500"
      >
        <CircularProgressLabel>
          {limitPercentage > 0 ? limitPercentage : 0}%
        </CircularProgressLabel>
      </MotionCircularProgress>
      <VStack w="full">
        <Heading size="md" color="orange.500">
          ROI Limit
        </Heading>
        <Heading size="sm" fontStyle="oblique">
          {idAccountMap?.maxLimitAmount} {currentNetwork?.MYUSD?.Symbol}
        </Heading>
      </VStack>
      <VStack w="full">
        <Heading size="md" color="orange.500">
          Referral Limit
        </Heading>
        <Heading size="sm" fontStyle="oblique">
          {idAccountMap?.maxLimitAmount} {currentNetwork?.MYUSD?.Symbol}
        </Heading>
      </VStack>
      <VStack w="full">
        <Heading size="md" color="red">
          Limit Reached
        </Heading>
        <Heading size="sm" fontStyle="oblique">
          {idAccountMap?.limitBalanceUSD} {currentNetwork?.MYUSD?.Symbol}
        </Heading>
      </VStack>
    </CardContainer>
  );
};
