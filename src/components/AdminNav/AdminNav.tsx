import { EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  IconButton,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { motion } from "framer-motion";
import { BsFillPersonDashFill, BsFillPersonPlusFill } from "react-icons/bs";
import { FaTree, FaUsers } from "react-icons/fa";
import { UserProfileCard } from "../UI";

const MotionHeading = motion(Heading);

export const AdminNav = () => {
  const { account } = useEthers();

  return (
    <Box
      boxShadow="base"
      borderRadius="50px"
      minH="90vh"
      w={300}
      bgColor={useColorModeValue("gray.100", "gray.900")}
      position="sticky"
      top={0}
    >
      <VStack w="full" py={10} spacing={5}>
        <UserProfileCard address={account!} />
        <VStack spacing={0}>
          <Heading color={useColorModeValue("pink.500", "pink.200")}>
            $21
          </Heading>
          <HStack>
            <Text>MyVee Price</Text>
            <EditIcon cursor="pointer" />
          </HStack>
        </VStack>
        <Divider />
        <VStack>
          <Button
            w="full"
            colorScheme="orange"
            rightIcon={<FaUsers />}
            variant="ghost"
          >
            Total Members
          </Button>
          <Button
            w="full"
            colorScheme="orange"
            rightIcon={<FaTree />}
            variant="ghost"
          >
            Tree
          </Button>
          <Button
            w="full"
            colorScheme="orange"
            rightIcon={<BsFillPersonPlusFill />}
            variant="ghost"
          >
            Activate ID
          </Button>
          <Button
            w="full"
            colorScheme="orange"
            rightIcon={<BsFillPersonDashFill />}
            variant="ghost"
          >
            Dectivate ID
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
};
