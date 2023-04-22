import { Wrap } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import {
  useGetIDTotalBusiness,
  useIDAccount,
} from "../../../../hooks/ReferralHooks";
import { LimitToExceed } from "./LimitToExceed/LimitToExceed";
import { UserBalaces } from "./UserBalances/UserBalaces";
import { UserBusiness } from "./UserBusiness/UserBusiness";
import { UserBusinessOld } from "./UserBusinessOld/UserBusinessOld";
import { UserRewards } from "./UserIncome/UserRewards";
import { UserROI } from "./UserStakings/ROI";
import { UserTeam } from "./UserTeam/UserTeam";

export const UserDashboard = () => {
  const { userID } = useParams();
  const userIDAccount = useIDAccount(userID);
  console.log(userIDAccount);

  return (
    <Wrap w="full" p={5} spacing={5} justify="center">
      {/* <UserROI /> */}
      <LimitToExceed idAccountMap={userIDAccount} />
      <UserBalaces idAccountMap={userIDAccount} />
      <UserBusinessOld idAccountMap={userIDAccount} />
      <UserBusiness idAccountMap={userIDAccount} />
      <UserRewards idAccountMap={userIDAccount} />
      <UserTeam idAccountMap={userIDAccount} />
    </Wrap>
  );
};
