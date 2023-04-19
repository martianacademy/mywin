import { Center, Divider, Heading, HStack, Icon } from "@chakra-ui/react";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";

import { MdVerified } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const MotionHStack = motion(HStack);

export const Logo = () => {
  const navigate = useNavigate();
  return (
    <MotionHStack
      onClick={() => navigate("/")}
      cursor="pointer"
      whileHover={{
        scale: 1.05,
      }}
      transition={{
        type: "spring",
        stiffness: 700,
      }}
    >
      <Center boxSize={10} borderWidth="medium" borderRadius="full">
        <FontAwesomeIcon icon={faCrown} color="#DD6B20" />
      </Center>
      <Center h={7}>
        <Divider orientation="vertical" />
      </Center>
      <HStack spacing={0}>
        <Heading size="md" fontWeight={500} color="orange.500" opacity={0.7}>
          My
        </Heading>
        <Heading size="md" fontWeight={900} color="orange.500">
          Win
        </Heading>
      </HStack>
      <Icon as={MdVerified} color="twitter.500"></Icon>
    </MotionHStack>
  );
};
