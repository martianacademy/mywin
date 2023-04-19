import { Heading, VStack } from "@chakra-ui/react";
import React from "react";
import { ConnectWalletButton } from "../../components/ConnectWalletButton/ConnectWalletButton";

export const ConnectWalletPage = () => {
  return (
    <VStack w="full" minH="100vh">
      <Heading>Please connect wallet to continue</Heading>
      <ConnectWalletButton />
    </VStack>
  );
};
