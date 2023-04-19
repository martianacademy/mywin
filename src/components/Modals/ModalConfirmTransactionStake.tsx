import {
  Button,
  Center,
  Divider,
  HStack,
  Icon,
  keyframes,
  ModalFooter,
  ModalHeader,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

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

export const ModalConfirmTransactionStake = ({
  currencySymbol,
  value,
  isLoading,
  onConfirm,
  onClose,
  children,
}: {
  currencySymbol: string;
  value: string;
  isLoading: boolean;
  onConfirm: () => void;
  onClose: () => void;
  children?: React.ReactNode;
}) => {
  return (
    <VStack w="full">
      <VStack w={300}>
        <ModalHeader textAlign="center" fontSize="md">
          You are about to join with {currencySymbol}
          <Center w={200}>
            <Divider></Divider>
          </Center>
        </ModalHeader>
        <HStack w="full">
          <Text>{currencySymbol}</Text>
          <Spacer />
          <Text>{value}</Text>
          <Icon color="red" as={FiArrowUpRight}></Icon>
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
