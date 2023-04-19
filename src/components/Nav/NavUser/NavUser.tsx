import {
  Avatar,
  Button,
  Divider,
  Heading,
  HStack,
  Spacer,
  Tag,
  Text,
  useColorModeValue,
  VStack,
  Icon,
} from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import React from "react";
import { BiLogInCircle } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";
import { ColorModeSwitcher } from "../../ColorModeSwitcher";
import { ConnectWalletButton } from "../../ConnectWalletButton/ConnectWalletButton";
import { NavMenuItems } from "../NavMenuItems";

export const NavUser = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { deactivate } = useEthers();
  return (
    <VStack
      w={250}
      bgColor={useColorModeValue("white", "gray.900")}
      minH="80vh"
      borderRadius="50px"
      position="sticky"
      top={0}
      py={10}
      spacing={10}
    >
      <VStack>
        <Avatar></Avatar>
        <ConnectWalletButton
          style={{
            colorScheme: "green",
          }}
        />
        <VStack spacing={0}>
          {/* <Heading size="sm">Name</Heading> */}
          <Text>@username</Text>
        </VStack>
      </VStack>
      <Divider />
      <VStack flex={1}>
        {NavMenuItems?.map((itemsOject, key) => {
          return (
            <Button
              w="full"
              key={key}
              variant={pathname === itemsOject?.link ? "solid" : "ghost"}
              fontSize="sm"
              borderRadius="xl"
              onClick={() => navigate(itemsOject?.link)}
              leftIcon={<Icon as={itemsOject.icon} color="pink.500" />}
            >
              {itemsOject?.name}
            </Button>
          );
        })}
      </VStack>
      <HStack w="full" px={5}>
        {/* <ColorModeSwitcher size="lg" /> */}
        <Spacer />
        <Icon
          as={BiLogInCircle}
          cursor="pointer"
          boxSize={7}
          color="pink.500"
          onClick={deactivate}
        ></Icon>
      </HStack>
    </VStack>
  );
};
