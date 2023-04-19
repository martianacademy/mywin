import { ChevronRightIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Divider,
  DrawerFooter,
  DrawerHeader,
  Heading,
  HStack,
  Icon,
  Image,
  keyframes,
  ModalFooter,
  ModalHeader,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { motion } from "framer-motion";
import { BsPatchCheckFill } from "react-icons/bs";
import { useSupportedNetworkInfo } from "../../../constants";

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

export const ModalTransactionSuccess = ({
  transactionHash,
  onClose,
}: {
  transactionHash: string;
  onClose: () => void;
}) => {
  const { chainId } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  const checkIconAnimation = `${checkBoxAnimation} infinite 1s`;
  return (
    <VStack w="full">
      <VStack w={300}>
        <ModalHeader textAlign="center" fontSize="md">
          Transaction Success
          <Center w={200}>
            <Divider></Divider>
          </Center>
        </ModalHeader>

        <Heading size="sm">Your transaction is successfull.</Heading>
        <VStack
          w="full"
          p={5}
          borderWidth="thick"
          borderRadius="3xl"
          spacing={5}
        >
          <Center boxSize={16}>
            <Icon
              as={BsPatchCheckFill}
              boxSize={20}
              color="green"
              animation={checkIconAnimation}
            ></Icon>
          </Center>
          <Button
            rightIcon={<ExternalLinkIcon />}
            as="a"
            target="_blank"
            href={currentNetwork?.Network.getExplorerTransactionLink(
              transactionHash
            )}
            borderRadius="xl"
          >
            <HStack w="max">
              <Text size="sm">
                View on {currentNetwork?.NetworkExplorerName}
              </Text>
              <Image
                src={currentNetwork?.NetworkExplorerLogo}
                boxSize={5}
              ></Image>
            </HStack>
          </Button>
        </VStack>
        <ModalFooter>
          <Button
            colorScheme="red"
            onClick={onClose}
            borderRadius="xl"
            w="300px"
            h={14}
          >
            Close
          </Button>
        </ModalFooter>
      </VStack>
    </VStack>
  );
};
