import { useColorModeValue, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import React, { ReactNode } from "react";

const MotionVStack = motion(VStack);

export const CardContainer = ({ children }: { children: ReactNode }) => {
  return (
    <MotionVStack
      p={2}
      spacing={5}
      borderRadius="50px"
      bgColor={useColorModeValue("gray.100", "gray.900")}
      whileHover={{
        scale: 0.95,
      }}
      whileTap={{
        scale: 0.95,
      }}
      transition={{
        type: "spring",
        stiffness: 700,
        staggerChildren: 0.5,
      }}
      borderWidth="thin"
      align="center"
    >
      <MotionVStack borderRadius="50px" spacing={5} py={5} px={2}>
        {children}
      </MotionVStack>
    </MotionVStack>
  );
};
