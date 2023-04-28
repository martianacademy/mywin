import {
  Grid,
  Heading,
  Icon,
  useBreakpointValue,
  Wrap,
} from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { FaUser } from "react-icons/fa";
import { CardContainer } from "../../../../../components";
import { UserRefereeCard } from "../../../../../components/UI/UserRefereeCard";
import { userIDAccountType } from "../../../../../hooks/ReferralHooks";

export const UserTeam = ({
  idAccountMap,
}: {
  idAccountMap: userIDAccountType;
}) => {
  return (
    <CardContainer >
      <Heading size="sm">Team</Heading>
      <Icon as={FaUser} boxSize={7}></Icon>
      <Wrap p={2} justify="Center" align="center" w="full">
        <Grid
          templateColumns={`repeat(${useBreakpointValue([
            1, 2, 3, 4, 5,
          ])}, 1fr)`}
          gap={6}
        >
          {idAccountMap?.teamIDs.length > 0 && (
            idAccountMap?.teamIDs.map((userID: string, key: number) => {
              return (
                <UserRefereeCard userID={userID} key={key}></UserRefereeCard>
              );
            })
          )}
        </Grid>
        {!idAccountMap?.teamIDs.length && <Heading w="full" textAlign="center">You have no team</Heading>}
      </Wrap>
    </CardContainer>
  );
};
