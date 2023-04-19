import { VStack } from "@chakra-ui/react";
import { JoinUI } from "../../components/JoinUI/JoinUI";

export const JoinPage = () => {
  return (
    <VStack w="full" flex={1} py={50}>
      <JoinUI />
    </VStack>
  );
};
