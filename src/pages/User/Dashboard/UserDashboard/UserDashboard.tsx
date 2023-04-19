import { Wrap } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useIDAccountMap } from "../../../../hooks/ReferralHooks";
import { LimitToExceed } from "./LimitToExceed/LimitToExceed";
import { UserBalaces } from "./UserBalances/UserBalaces";
import { UserBusiness } from "./UserBusiness/UserBusiness";
import { UserRewards } from "./UserIncome/UserRewards";
import { UserROI } from "./UserStakings/ROI";
import { UserTeam } from "./UserTeam/UserTeam";

export const UserDashboard = () => {
  const { userID } = useParams();
  const idAccountMap = useIDAccountMap(userID!);
  return (
    <Wrap w="full" p={5} spacing={5} justify="center">
      <LimitToExceed idAccountMap={idAccountMap} />
      <UserBalaces idAccountMap={idAccountMap} />
      <UserBusiness idAccountMap={idAccountMap} />
      <UserRewards idAccountMap={idAccountMap} />
      {/* <UserROI /> */}
      <UserTeam idAccountMap={idAccountMap} />
    </Wrap>
  );
};
