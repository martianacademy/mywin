import {
  Button,
  Center,
  Divider,
  HStack,
  Icon,
  Image,
  keyframes,
  ModalFooter,
  ModalHeader,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Contract } from "ethers";
import { motion } from "framer-motion";
import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";

const MotionIcon = motion(Icon);

const checkBoxAnimation = keyframes`
0% {
  transform: scale(0.7)
}
50% {
  transform: scale(1)
}
100% {
transform: scale(0.7)
}
`;

export const ModalConfirmTransaction = ({
  heading,
  currencyObject,
  value,
  isLoading,
  onConfirm,
  onClose,
  children,
  transactionType,
}: {
  heading?: "Transact" | string;
  currencyObject: {
    ContractAddress: string;
    ContractInterface: Contract;
    Name: string;
    Symbol: string;
    Decimals: number;
    Logo: string;
};

  value: string;
  isLoading: boolean;
  onConfirm: () => void;
  onClose: () => void;
  children?: React.ReactNode;
  transactionType?: "Outgoing" | "Incoming"
}) => {
  return (
    <VStack w="full">
      <VStack w={300}>
        <ModalHeader textAlign="center" fontSize="md">
          You are about to {heading}.
          <Center w={200}>
            <Divider></Divider>
          </Center>
        </ModalHeader>
        <HStack w="full">
          <Image src={currencyObject?.Logo} boxSize={8}></Image>
          <Text>{currencyObject?.Symbol}</Text>
          <Spacer />
          <Text>{value}</Text>
          <Icon color={transactionType === "Outgoing" ? "red" : "green"} as={transactionType === "Outgoing" ? FiArrowUpRight : FiArrowDownLeft}></Icon>
        </HStack>
        {children}
      </VStack>
      <ModalFooter w="full">
        <HStack w="full">
          <Button
            variant="outline"
            colorScheme="red"
            onClick={onClose}
            borderRadius="xl"
          >
            Close
          </Button>
          <Button
            colorScheme="green"
            onClick={onConfirm}
            borderRadius="xl"
            w="full"
            isLoading={isLoading}
            loadingText="Confirm from metamask."
          >
            Confirm
          </Button>
        </HStack>
      </ModalFooter>
    </VStack>
  );
};
