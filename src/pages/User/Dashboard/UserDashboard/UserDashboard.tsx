import { Wrap } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { LimitToExceedComponent } from "../../../../components/User/LimitToExceedComponent";
import { useIDAccount } from "../../../../hooks/ReferralHooks";
import { UserBalaces } from "./UserBalances/UserBalaces";
import { UserBusiness } from "./UserBusiness/UserBusiness";
import { UserRewards } from "./UserIncome/UserRewards";
import { UserTeam } from "./UserTeam/UserTeam";

export const UserDashboard = () => {
  const { userID } = useParams();
  const userIDAccount = useIDAccount(userID ?? "0");
  return (
    <Wrap w="full" p={5} spacing={5} justify="center" overflow="visible">
      {/* <UserROI /> */}
      <LimitToExceedComponent idAccountMap={userIDAccount} />
      <UserBalaces idAccountMap={userIDAccount} />
      <UserBusiness idAccountMap={userIDAccount} />
      <UserRewards idAccountMap={userIDAccount} />
      <UserTeam idAccountMap={userIDAccount} />
    </Wrap>
  );
};
