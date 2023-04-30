import { Box, useColorModeValue, VStack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Footer, Nav } from "./components";
import { useIDAccount } from "./hooks/ReferralHooks";
import { ScrollToTop } from "./Navigation";

export const App = () => {

  return (
    <VStack
      w="full"
      minH="100vh"
      bgColor={useColorModeValue("gray.100", "gray.800")}
      p={0}
      spacing={0}
    >
      <ScrollToTop />
      <Nav />
      <Box w="full" flex={1}>
        <Outlet />
      </Box>
      <Footer />
    </VStack>
  );
};
