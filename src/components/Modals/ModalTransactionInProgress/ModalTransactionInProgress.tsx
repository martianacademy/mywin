import {
  Center,
  Divider,
  Heading,
  HStack,
  Image,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text,
  VStack,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import React from "react";
import { useSupportedNetworkInfo } from "../../../constants";

export const ModalTransactionInProgress = ({
  onClickNative,
  onClickUSDT,
  onClose,
}: {
  onClickNative?: () => void;
  onClickUSDT?: () => void;
  onClose?: () => void;
}) => {
  const { chainId } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];

  return (
    <VStack spacing={0}>
      <ModalHeader textAlign="center" fontSize="md">
        Transaction in progress...
      </ModalHeader>
      <Center w={300}>
        <Divider />
      </Center>
      <ModalBody>
        <VStack w="full">
          <Spinner />
        </VStack>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </VStack>
  );
};
