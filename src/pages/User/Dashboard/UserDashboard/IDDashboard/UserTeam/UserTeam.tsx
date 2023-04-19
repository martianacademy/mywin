import {
  Grid,
  Heading,
  Icon,
  useBreakpointValue,
  Wrap,
} from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { FaUser } from "react-icons/fa";
import { CardContainer } from "../../../../../../components";
import { UserRefereeCard } from "../../../../../../components/UI/UserRefereeCard";

export const UserTeam = () => {
  const { chainId, account } = useEthers();
  return (
    <CardContainer>
      <Heading size="sm">Team</Heading>
      <Icon as={FaUser} boxSize={7}></Icon>
      <Wrap p={2} justify="Center" align="center">
        <Grid
          templateColumns={`repeat(${useBreakpointValue([
            1, 2, 3, 4, 5,
          ])}, 1fr)`}
          gap={6}
        >
          <UserRefereeCard address={account}></UserRefereeCard>
          <UserRefereeCard address={account}></UserRefereeCard>
          <UserRefereeCard address={account}></UserRefereeCard>
          <UserRefereeCard address={account}></UserRefereeCard>
          <UserRefereeCard address={account}></UserRefereeCard>
          <UserRefereeCard address={account}></UserRefereeCard>
          <UserRefereeCard address={account}></UserRefereeCard>
          <UserRefereeCard address={account}></UserRefereeCard>
        </Grid>
      </Wrap>
    </CardContainer>
  );
};
