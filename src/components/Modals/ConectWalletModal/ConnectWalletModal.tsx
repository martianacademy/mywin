import {
  Button,
  Center,
  Divider,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react";
import { WalletConnectors } from "../../WalletConnectores";

export const ConnectWalletModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <>
      <ModalHeader textAlign="center">Connect wallet</ModalHeader>
      <Center>
        <Divider></Divider>
      </Center>
      <ModalBody>
        <WalletConnectors />
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="red" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </>
  );
};
