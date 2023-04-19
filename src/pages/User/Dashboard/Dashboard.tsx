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
import { useEthers } from "@usedapp/core";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { IoIosWallet } from "react-icons/io";
import { NavUser } from "../../../components";
import { NavMenuItems } from "../../../components/Nav/NavMenuItems";
import { useSupportedNetworkInfo } from "../../../constants";
import { useReferralAccountMap } from "../../../hooks/ReferralHooks";

export const Dashboard = () => {
  const { chainId } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  const { account } = useEthers();
  const referralAccount = useReferralAccountMap(account!);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isOpen, onToggle } = useDisclosure();
  const [userNavHeading, setUserNavHeading] = useState("");

  useEffect(() => {
    NavMenuItems.map((menuObject) => {
      if (pathname === menuObject.link) {
        setUserNavHeading(menuObject.name);
      }
    });
  }, [pathname]);
  return (
    <VStack w="full">
      <Show below="md">
        <VStack
          w="full"
          position="sticky"
          top="80px"
          zIndex={1111}
          filter="auto"
          backdropFilter="blur(25px) "
          p={2}
        >
          <HStack w="full" px={5} onClick={onToggle}>
            <Tag colorScheme="orange">{userNavHeading}</Tag>
            <Spacer />
            <Icon as={isOpen ? ChevronUpIcon : ChevronDownIcon}></Icon>
          </HStack>
          {isOpen && <Divider />}
          <Collapse in={isOpen} animateOpacity>
            <VStack divider={<StackDivider />} w={300}>
              {NavMenuItems.map((menuObject, key) => {
                return (
                  <HStack w="full" px={5} key={key}>
                    <Text
                      w="full"
                      fontSize="sm"
                      onClick={() => {
                        onToggle();
                        navigate(menuObject.link);
                      }}
                    >
                      {menuObject?.name}
                    </Text>
                    <Icon as={menuObject.icon} color="orange.500"></Icon>
                  </HStack>
                );
              })}
            </VStack>
          </Collapse>
        </VStack>
      </Show>
      <VStack p={5}>
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
              <Tag p={2} colorScheme="pink" borderRadius="xl">
                <HStack>
                  <Icon as={IoIosWallet} boxSize={5}></Icon>
                  <Text color="pink.500">
                    580 {currentNetwork?.Native?.Symbol}
                  </Text>
                </HStack>
              </Tag>
            </HStack>
            <Divider />
            <Outlet />
          </VStack>
        </HStack>
      </VStack>
    </VStack>
  );
};
