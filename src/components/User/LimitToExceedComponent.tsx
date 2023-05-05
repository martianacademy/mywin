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
    (idAccountMap?.topUpIncome / idAccountMap?.maxLimit) * 100;
  const circularColor = (limitPercentage <= 25) ? "orange.300" : limitPercentage > 25 && limitPercentage <= 50 ? "green.300" : limitPercentage > 50 && limitPercentage <= 75 ? "yellow.300" : "red.300";
  return (
    <CardContainer>
      <Heading size="sm">Limit Stats</Heading>
      <CircularProgress
        size={200}
        thickness="15px"
        color={circularColor}
        value={
          limitPercentage > 0
            ? limitPercentage
            : idAccountMap?.isActive
            ? 100
            : 0
        }
      >
        {!idAccountMap?.isActive ? (
          <CircularProgressLabel color={circularColor} fontSize="4xl" fontWeight={900}>
            {limitPercentage > 0 ? limitPercentage?.toFixed(0) : 0}%
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
          {idAccountMap?.maxLimit?.toFixed(2)} {currentNetwork?.MYUSD?.Symbol}
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
          {idAccountMap?.topUpIncome?.toFixed(5)} {currentNetwork?.MYUSD?.Symbol}
        </Heading>
      </VStack>
    </CardContainer>
  );
};
