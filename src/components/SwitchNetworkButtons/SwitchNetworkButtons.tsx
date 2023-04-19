import {
  Button,
  HStack,
  Image,
  Spinner,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useConfig, useEthers } from "@usedapp/core";
import { getChainById } from "@usedapp/core/dist/esm/src/helpers";
import { useState } from "react";
import { useSupportedNetworkInfo } from "../../constants";

export const SwitchNetworkButtons = () => {
  const { switchNetwork } = useEthers();
  const dappConfig = useConfig();
  const currenNetwork = useSupportedNetworkInfo;
  const [switchingSupportedNetwork, setSwitchingSupportedNetwork] =
    useState(false);
  const toast = useToast();

  const handleSwitchNetwork = async (e: any) => {
    const chainId = Number(e.target.value);

    try {
      setSwitchingSupportedNetwork(true);
      await switchNetwork(chainId);
      toast({
        title: `You are on ${getChainById(chainId)?.chainName} Network`,
        description: "",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setSwitchingSupportedNetwork(false);
    } catch (e: any) {
      setSwitchingSupportedNetwork(false);
      toast({
        title: "Error",
        description: e.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  return (
    <VStack w="full">
      {!switchingSupportedNetwork ? (
        dappConfig?.networks?.map((network, key) => {
          return (
            <Button
              colorScheme="pink"
              variant="outline"
              onClick={handleSwitchNetwork}
              loadingText="Switching"
              spinnerPlacement="end"
              borderRadius="xl"
              key={key}
              rightIcon={
                <Image
                  src={currenNetwork[network?.chainId!].Native.Logo}
                  w="20px"
                ></Image>
              }
              value={network?.chainId}
            >
              Switch to {network?.chainName}
            </Button>
          );
        })
      ) : (
        <HStack>
          <Text>Swtiching network</Text>
          <Spinner />
        </HStack>
      )}
    </VStack>
  );
};
