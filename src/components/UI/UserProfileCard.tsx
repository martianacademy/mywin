import {
  Avatar,
  AvatarBadge,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { ConnectWalletButton } from "../ConnectWalletButton/ConnectWalletButton";
import { UserAddressActionButton } from "./UserAddressActionButton";

export const UserProfileCard = ({ address }: { address: string }) => {
  return (
    <VStack>
      <Avatar size="lg">
        <AvatarBadge boxSize={5} bgColor="green"></AvatarBadge>
      </Avatar>
      <VStack spacing={0}>
        <Heading size="sm">Name</Heading>
        <HStack spacing={0}>
          <Text>@</Text>
          <Text>username</Text>
        </HStack>
      </VStack>
      <ConnectWalletButton
        style={{
          colorScheme: "green",
        }}
      ></ConnectWalletButton>
      <UserAddressActionButton
        address={address}
        style={{
          size: "sm",
        }}
      ></UserAddressActionButton>
    </VStack>
  );
};
