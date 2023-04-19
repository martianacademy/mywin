import {
  Divider,
  Heading,
  Hide,
  HStack,
  Icon,
  Spacer,
  Tag,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { Outlet } from "react-router-dom";
import { NavUser } from "../../components";
import { useSupportedNetworkInfo } from "../../constants";

import { IoIosWallet } from "react-icons/io";

export const UserOld = () => {
  const { account, chainId } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  return (
    <HStack w="full" p={5} align="flex-start">
      <Hide below="md">
        <NavUser />
      </Hide>
      <VStack
        minH="80vh"
        flex={1}
        bgColor={useColorModeValue("white", "gray.900")}
        borderRadius="50px"
        w="full"
        py={10}
        px={5}
      >
        <HStack w="full">
          <Heading size="md">Hey! Welcome</Heading>
          <Spacer />
          <Tag p={2} colorScheme="pink" borderRadius="xl">
            <HStack>
              <Icon as={IoIosWallet} boxSize={5}></Icon>
              <Text color="pink.500">580 {currentNetwork?.Native?.Symbol}</Text>
            </HStack>
          </Tag>
        </HStack>
        <Divider />
        <Outlet />
      </VStack>
    </HStack>
  );
};
