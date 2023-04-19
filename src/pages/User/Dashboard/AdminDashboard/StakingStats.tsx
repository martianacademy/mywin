import {
  Heading,
  HStack,
  Text,
  Wrap,
  Icon,
  VStack,
  CircularProgress,
  Tag,
} from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { IconType } from "react-icons";
import { FaPiggyBank } from "react-icons/fa";
import { CardContainer } from "../../../../components";

const StakingInfoContainer = ({
  heading,
  value,
  icon,
  children,
}: {
  heading: string;
  value: string;
  icon?: IconType;
  children?: ReactNode;
}) => {
  return (
    <HStack justify="space-between" p={3} borderWidth="thin" borderRadius="3xl">
      <VStack textAlign="center" w="full">
        <Heading size="md" opacity={0.7}>
          {heading}
        </Heading>
        <Heading size="md" fontWeight={900}>
          {value}
        </Heading>
      </VStack>
      {icon && <Icon as={icon} boxSize={14}></Icon>}
      {children}
    </HStack>
  );
};

export const StakingStats = () => {
  return (
    <CardContainer>
      <Wrap w="full" spacing={10}>
        <StakingInfoContainer
          heading="Staked Amount"
          value="$100000"
          icon={FaPiggyBank}
        ></StakingInfoContainer>
        <StakingInfoContainer
          heading="Total Staking IDs"
          value="100000"
          icon={FaPiggyBank}
        ></StakingInfoContainer>
        <StakingInfoContainer
          heading="Staking Rewards Paid"
          value="100000"
          icon={FaPiggyBank}
        ></StakingInfoContainer>
        <StakingInfoContainer heading="Active Stakings Amount" value="$100000">
          <CircularProgress
            value={75}
            size="70px"
            thickness={16}
          ></CircularProgress>
        </StakingInfoContainer>
        <StakingInfoContainer heading="Ended Stakings Amount" value="$100000">
          <CircularProgress
            value={25}
            size="70px"
            thickness={16}
          ></CircularProgress>
        </StakingInfoContainer>
      </Wrap>
    </CardContainer>
  );
};
