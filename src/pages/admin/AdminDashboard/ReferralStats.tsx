import { Heading, HStack, Text, VStack, Icon } from "@chakra-ui/react";
import React from "react";
import { GiPayMoney } from "react-icons/gi";
import { CardContainer } from "../../../components";

export const ReferralStats = () => {
  return (
    <CardContainer>
      <HStack w="full" justify="space-between">
        <VStack>
          <Heading size="md" textAlign="center">
            Total Referral Paid
          </Heading>
          <Heading size="md">$100000</Heading>
        </VStack>
        <Icon as={GiPayMoney} boxSize={14}></Icon>
      </HStack>
    </CardContainer>
  );
};
