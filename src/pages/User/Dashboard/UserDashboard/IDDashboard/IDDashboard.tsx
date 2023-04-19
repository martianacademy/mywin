import { HStack, VStack, Wrap, Icon, Text } from "@chakra-ui/react";
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { LimitToExceed } from "./LimitToExceed/LimitToExceed";
import { UserBalaces } from "./UserBalances/UserBalaces";
import { UserBusiness } from "./UserBusiness/UserBusiness";
import { UserIncome } from "./UserIncome/UserIncome";
import { UserStakings } from "./UserStakings/UserStakings";
import { UserTeam } from "./UserTeam/UserTeam";

export const IDDashboard = () => {
  return (
    <VStack w="full">
      <Wrap w="full" justify="center" spacing={10}>
        <LimitToExceed />
        <UserBalaces />
        <UserIncome />
        <UserBusiness />
        <UserStakings />
        <UserTeam />
      </Wrap>
    </VStack>
  );
};
