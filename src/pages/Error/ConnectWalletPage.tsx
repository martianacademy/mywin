import { Center, Heading, VStack } from "@chakra-ui/react";
import React from "react";
import { ConnectWalletButton } from "../../components/ConnectWalletButton/ConnectWalletButton";

export const ConnectWalletPage = () => {
  return (
    <Center w="full" minH="100vh">
      <VStack>
        <Heading>Please connect wallet to continue</Heading>
        <ConnectWalletButton />
      </VStack>
    </Center>
  );
};
