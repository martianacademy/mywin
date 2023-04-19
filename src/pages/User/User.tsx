import { VStack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

export const User = () => {
  return (
    <VStack w="full">
      <Outlet />
    </VStack>
  );
};
