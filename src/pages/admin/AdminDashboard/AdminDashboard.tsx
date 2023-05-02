import {
  Box,
  Heading,
  HStack,
  Stack,
  Text,
  useColorModeValue,
  VStack,
  Wrap,
  Icon,
  CircularProgress,
  Divider,
  Hide,
} from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { FaMoneyBill, FaPiggyBank, FaUsers } from "react-icons/fa";
import { GiPayMoney } from "react-icons/gi";
import { AdminNav, CardContainer } from "../../../components";
import { ReferralStats } from "./ReferralStats";
import { StakingStats } from "./StakingStats";
import { TotalUsersStats } from "./TotalUsersStats";

export const AdminDashboard = () => {
  const { account } = useEthers();
  return (
    <VStack w="full" p={5}>
      <HStack w="full" align="flex-start">
        <Hide below="md">
          <AdminNav />
        </Hide>
        <Box
          minH="80vh"
          flex={1}
          bgColor={useColorModeValue("gray.100", "gray.900")}
          boxShadow="base"
          borderRadius="50px"
        >
          <Wrap w="full" spacing={5} p={5} justify="center">
            <TotalUsersStats />
            <ReferralStats />
            <StakingStats />
          </Wrap>
        </Box>
      </HStack>
    </VStack>
  );
};
