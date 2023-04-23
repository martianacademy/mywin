import {
  Collapse,
  Divider,
  Heading,
  Hide,
  HStack,
  Icon,
  Show,
  Spacer,
  StackDivider,
  Tag,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useEtherBalance, useEthers } from "@usedapp/core";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";

import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { formatEther } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import { IoIosWallet } from "react-icons/io";
import { NavUser } from "../../../components";
import { NavMenuItems } from "../../../components/Nav/NavMenuItems";
import { useSupportedNetworkInfo } from "../../../constants";
import { useReferralAccountMap } from "../../../hooks/ReferralHooks";
import { NavUserSmall } from "../../../components/Nav/NavUser/NavUserSmall";

export const Dashboard = () => {
  const { chainId } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  const { account } = useEthers();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isOpen, onToggle } = useDisclosure();
  const [userNavHeading, setUserNavHeading] = useState("Dashboard");
  const userNativeBalance = useEtherBalance(account);

  return (
    <VStack w="full">
      <Show below="md">
        <NavUserSmall />
      </Show>
      <VStack p={5} w="full">
        <HStack w="full" align="flex-start" spacing={5}>
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
              {/* <Tag p={2} colorScheme="pink" borderRadius="xl">
                <HStack>
                  <Icon as={IoIosWallet} boxSize={5}></Icon>
                  <Text color="pink.500">
                    {Number(formatEther(userNativeBalance ?? 0)).toFixed(2)}{" "}
                    {currentNetwork?.Native?.Symbol}
                  </Text>
                </HStack>
              </Tag> */}
            </HStack>
            <Divider />
            <Outlet />
          </VStack>
        </HStack>
      </VStack>
    </VStack>
  );
};
