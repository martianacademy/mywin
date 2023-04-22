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
import {
  useIDAccount,
  userIDAccountType,
} from "../../../../../hooks/ReferralHooks";

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
        color={idAccountMap?.isDisabled ? "red" : "orange.500"}
        value={
          limitPercentage > 0
            ? limitPercentage
            : idAccountMap?.isDisabled
            ? 100
            : 0
        }
      >
        {idAccountMap?.isDisabled ? (
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
          {idAccountMap?.maxLimitAmount} {currentNetwork?.MYUSD?.Symbol}
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
          {idAccountMap?.limitBalanceUSD} {currentNetwork?.MYUSD?.Symbol}
        </Heading>
      </VStack>
    </CardContainer>
  );
};
