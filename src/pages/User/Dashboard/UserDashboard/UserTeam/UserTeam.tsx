import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Grid,
  Heading,
  Icon,
  useBreakpointValue,
  VStack,
  Wrap,
} from '@chakra-ui/react';
import { useEthers } from '@usedapp/core';
import { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { CardContainer } from '../../../../../components';
import { UserRefereeCard } from '../../../../../components/UI/UserRefereeCard';
import { userIDAccountType } from '../../../../../hooks/ReferralHooks';

export const UserTeam = ({
  idAccountMap,
}: {
  idAccountMap: userIDAccountType;
}) => {
  const [loadMaxTeam, setLoadMaxTeam] = useState(10);

  useEffect(() => {
    if (idAccountMap?.teamIDs.length < loadMaxTeam) {
      setLoadMaxTeam(idAccountMap?.teamIDs.length);
    }
  }, [loadMaxTeam, idAccountMap?.teamIDs.length]);

  return (
    <CardContainer>
      <Heading size="sm">Team</Heading>
      <Icon as={FaUser} boxSize={7}></Icon>
      <VStack p={2} justify="Center" align="center" w="full">
        <Grid
          templateColumns={`repeat(${useBreakpointValue([
            1, 2, 3, 4, 5,
          ])}, 1fr)`}
          gap={6}
        >
          {idAccountMap?.teamIDs.length > 0 &&
            idAccountMap?.teamIDs.length > loadMaxTeam &&
            idAccountMap?.teamIDs.map((userID: string, key: number) => {
              if (key <= loadMaxTeam) {
                return (
                  <VStack>
                    <UserRefereeCard
                      userID={userID}
                      key={key}
                    ></UserRefereeCard>
                    
                    
                  </VStack>
                );
              }
            })}
            
        </Grid>
        {idAccountMap?.teamIDs.length > loadMaxTeam && <Icon as={ChevronDownIcon} boxSize={10} onClick={() => setLoadMaxTeam((prev) => prev + 10)}></Icon>}
        {!idAccountMap?.teamIDs.length && (
          <Heading w="full" textAlign="center">
            You have no team
          </Heading>
        )}
      </VStack>
    </CardContainer>
  );
};
