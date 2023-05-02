import {
  Heading,
  HStack,
  VStack,
  Icon,
  Divider,
  CircularProgress,
} from "@chakra-ui/react";
import React from "react";
import { FaUsers } from "react-icons/fa";
import { CardContainer } from "../../../components";

export const TotalUsersStats = () => {
  return (
    <CardContainer>
      <VStack w="full" spacing={10}>
        <HStack w="full" justify="space-between">
          <VStack>
            <Heading size="md" opacity={0.5}>
              Total Users
            </Heading>
            <Heading fontWeight={900} size="lg">
              14000
            </Heading>
          </VStack>
          <Icon as={FaUsers} boxSize={14}></Icon>
        </HStack>
        <Divider />
        <HStack w="full" justify="space-between">
          <VStack>
            <Heading size="md" opacity={0.5}>
              Active Users
            </Heading>
            <Heading fontWeight={900} size="lg">
              10000
            </Heading>
          </VStack>
          <CircularProgress
            value={75}
            size="70px"
            thickness={16}
          ></CircularProgress>
        </HStack>
        <Divider />
        <HStack w="full" justify="space-between">
          <VStack>
            <Heading size="md" opacity={0.5}>
              Inactive Users
            </Heading>
            <Heading fontWeight={900} size="lg">
              4000
            </Heading>
          </VStack>
          <CircularProgress
            value={25}
            size="75px"
            thickness={16}
          ></CircularProgress>
        </HStack>
      </VStack>
    </CardContainer>
  );
};
