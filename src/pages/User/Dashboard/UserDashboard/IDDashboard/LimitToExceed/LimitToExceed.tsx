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
import { CardContainer } from "../../../../../../components";
import { useSupportedNetworkInfo } from "../../../../../../constants";

const MotionCircularProgress = motion(CircularProgress);

export const LimitToExceed = () => {
  const { chainId, account } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  return (
    <CardContainer>
      <Heading size="sm">Limit Remaining</Heading>
      <MotionCircularProgress
        size={200}
        thickness="15px"
        value={80}
        color="pink.500"
      >
        <CircularProgressLabel>80%</CircularProgressLabel>
      </MotionCircularProgress>
      <VStack w="full">
        <Heading size="md" color="orange.500">
          Reward Limit
        </Heading>
        <Heading size="sm" fontStyle="oblique">
          300 {currentNetwork?.Native?.Symbol}
        </Heading>
      </VStack>
      <VStack w="full">
        <Heading size="md" color="orange.500">
          Referral Limit
        </Heading>
        <Heading size="sm" fontStyle="oblique">
          300 {currentNetwork?.Native?.Symbol}
        </Heading>
      </VStack>
      <VStack w="full">
        <Heading size="md" color="red">
          Limit Reached
        </Heading>
        <Heading size="sm" fontStyle="oblique">
          250 {currentNetwork?.Native?.Symbol}
        </Heading>
      </VStack>
    </CardContainer>
  );
};
