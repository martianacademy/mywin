import {
  Button,
  Center,
  Divider,
  HStack,
  ModalBody,
  ModalFooter,
  ModalHeader,
  VStack,
} from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { FaPowerOff } from "react-icons/fa";
import { NetworkInfoCard } from "./NetworkInfoCard";
import { UserBalances } from "./UserBalances";

export const WalletModal = ({ onClose }: { onClose: () => void }) => {
  const { deactivate } = useEthers();
  return (
    <>
      <ModalHeader textAlign="center">Your Wallet</ModalHeader>
      <Center>
        <Divider></Divider>
      </Center>
      <ModalBody>
        <VStack>
          <NetworkInfoCard />
          <UserBalances />
        </VStack>
      </ModalBody>
      <ModalFooter>
        <HStack>
          <Button colorScheme="red" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            w={200}
            colorScheme="red"
            rightIcon={<FaPowerOff />}
            onClick={deactivate}
          >
            Disconnect Wallet
          </Button>
        </HStack>
      </ModalFooter>
    </>
  );
};
