import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Divider,
  Grid,
  Heading,
  HStack,
  Icon,
  Tag,
  Text,
  useBreakpointValue,
  VStack,
  Wrap,
} from '@chakra-ui/react';
import { useEthers } from '@usedapp/core';
import { useEffect, useState } from 'react';
import { FaUser, FaUsers } from 'react-icons/fa';
import { HiUserGroup, HiUsers } from 'react-icons/hi';
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
    if (idAccountMap?.teamIds.length < loadMaxTeam) {
      setLoadMaxTeam(idAccountMap?.teamIds.length);
    }
  }, [loadMaxTeam, idAccountMap?.teamIds.length]);

  return (
    <CardContainer>
      <Heading size="sm">Team</Heading>
      <Icon as={FaUser} boxSize={7}></Icon>
      <Divider/>
      <HStack justify="center" align="center">
      <Tag p={3} borderRadius="3xl">
        <VStack>
          <Heading size="md" color="orange.500">{idAccountMap.refereeIds.length}</Heading>
          <Text >Referee</Text>
          <Icon as={HiUsers} boxSize={10}></Icon>
        </VStack>
      </Tag>
      <Tag p={3} borderRadius="3xl">
        <VStack>
          <Heading size="md" color="orange.500">{idAccountMap.teamIds.length}</Heading>
          <Text >Team</Text>
          <Icon as={FaUsers} boxSize={10}></Icon>
        </VStack>
      </Tag>
      </HStack>
      {/* <Divider/>
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
      </VStack> */}
    </CardContainer>
  );
};
