import { Center, Heading, Image, VStack } from "@chakra-ui/react";
import React from "react";
import { MetamaskWalletLogoSVG } from "../../assets";
import { SwitchNetworkButtons } from "../../components/SwitchNetworkButtons";

export const SwitchToSupportedNetwork = () => {
  return (
    <Center w="full" minH="100vh">
      <VStack spacing={5}>
        <Image src={MetamaskWalletLogoSVG} boxSize={100}></Image>
        <Heading textAlign="center" w="90%">
          Please switch to supported network.
        </Heading>
        <SwitchNetworkButtons />
      </VStack>
    </Center>
  );
};
