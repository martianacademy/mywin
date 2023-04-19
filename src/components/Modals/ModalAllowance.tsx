import { ChevronRightIcon, InfoIcon, WarningIcon } from "@chakra-ui/icons";
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
  Icon,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import { useContractFunction, useEthers } from "@usedapp/core";
import { Contract, utils } from "ethers";
import React, { useEffect, useState } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import { useSupportedNetworkInfo } from "../../constants";

export const ModalAllowance = ({
  tokenName,
  spenderAddress,
  valueToApprove,
  onClose,
}: {
  tokenName: string;
  spenderAddress: string;
  valueToApprove: number;
  onClose?: () => void;
}) => {
  const toast = useToast();
  const { chainId } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  const [transactionStatus, setTransactionStatus] = useState<
    "Mining" | "Success" | "Loading" | "No" | "Error"
  >("No");
  const { send, state, resetState } = useContractFunction(
    // @ts-ignore
    currentNetwork?.[tokenName]?.ContractInterface,
    "approve"
  );

  const handleApprove = async () => {
    try {
      setTransactionStatus("Loading");
      await send(
        spenderAddress,
        utils.parseUnits(
          valueToApprove.toString(), // @ts-ignore
          currentNetwork?.[tokenName]?.Decimals
        )
      );
      toast({
        title: "Transaction Approved.",
        description: "",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setTransactionStatus("No");
    } catch (err: any) {
      console.log(err);
      setTransactionStatus("No");
      toast({
        title: "Error in Approving the transaction.",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (state.status === "Mining") {
      setTransactionStatus("Loading");
    } else if (state.status === "Success") {
      setTransactionStatus("No");
      resetState();
    }
  }, [state]);

  return (
    <VStack spacing={0}>
      <ModalHeader textAlign="center" fontSize="md">
        Insufficient Allowance <Icon as={WarningIcon} color="red"></Icon>
      </ModalHeader>
      <Center w={300} pb={5}>
        <Divider />
      </Center>
      <Text size="sm">Please allow the transaction to proceed.</Text>
      <ModalBody w="full" px={10}>
        <HStack spacing={5} p={5} w="full">
          <VStack
            cursor="pointer"
            onClick={() => {
              onClose!();
            }}
          >
            <Image
              boxSize={10}
              src={
                // @ts-ignore
                currentNetwork?.[tokenName]?.Logo
              }
            ></Image>
            <Heading size="sm" opacity={0.75}>
              {
                // @ts-ignore
                currentNetwork?.[tokenName]?.Symbol
              }
            </Heading>
          </VStack>
          <Spacer />
          <VStack spacing={0}>
            <Text fontSize="sm">Approve</Text>
            <Icon as={FaLongArrowAltRight} boxSize={10}></Icon>
          </VStack>
          <Spacer />
          <Text>{valueToApprove}</Text>
        </HStack>
      </ModalBody>
      <ModalFooter>
        <HStack>
          <Button colorScheme="red" borderRadius="xl" onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="green"
            borderRadius="xl"
            w={200}
            onClick={handleApprove}
            rightIcon={<ChevronRightIcon />}
            isLoading={transactionStatus === "Loading"}
          >
            Proceed
          </Button>
        </HStack>
      </ModalFooter>
    </VStack>
  );
};
