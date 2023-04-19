import {
  Button,
  ButtonProps,
  Hide,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { shortenAddress, useEthers } from "@usedapp/core";
import { ConnectWalletModal, WalletModal } from "../Modals";

export const ConnectWalletButton = ({ style }: { style?: ButtonProps }) => {
  const { account } = useEthers();
  const { onOpen, isOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen} borderRadius="xl" {...style}>
        <Text fontSize="sm">
          {account ? (
            shortenAddress(account)
          ) : (
            <>
              Connect <Hide below="sm">Wallet</Hide>
            </>
          )}
        </Text>
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent w="95%" borderRadius="3xl">
          <ModalCloseButton />
          {account ? (
            <WalletModal onClose={onClose}></WalletModal>
          ) : (
            <ConnectWalletModal onClose={onClose} />
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
