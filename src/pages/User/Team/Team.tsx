import { Heading, Icon, VStack, Wrap } from "@chakra-ui/react";
import { useState } from "react";
import { FaArrowDown, FaUserAstronaut, FaUserCheck } from "react-icons/fa";
import { HiUsers } from "react-icons/hi";
import { useParams } from "react-router-dom";
import { UserReferralCard } from "../../../components";
import { useIDAccount } from "../../../hooks/ReferralHooks";

export const Team = () => {
  const { userID } = useParams();
  const userIDAccount = useIDAccount(userID);
  return (
    <VStack py={10} px={5} spacing={10} w="full">
      <Heading>Your Team Object</Heading>
      {Number(userIDAccount.refererID) > 0 && (
        <VStack>
          <UserReferralCard
            heading="Referrer"
            icon={FaUserAstronaut}
            id={userIDAccount?.refererID}
          ></UserReferralCard>
          <Icon as={FaArrowDown} boxSize={10}></Icon>
        </VStack>
      )}
      <VStack>
        <UserReferralCard
          heading="Your"
          icon={FaUserCheck}
          id={userIDAccount?.id}
        ></UserReferralCard>
        <Icon as={FaArrowDown} boxSize={10}></Icon>
      </VStack>
      <VStack w="full">
        {userIDAccount?.refereeIDs.length > 0 ? (
          <Wrap justify="center" w="full" spacing={5} overflow="visible">
            {userIDAccount?.refereeIDs.map((id: string, key: number) => {
              return (
                <UserReferralCard
                  heading="Referee"
                  icon={HiUsers}
                  id={id}
                ></UserReferralCard>
              );
            })}
          </Wrap>
        ) : (
          <Heading>You have no referee</Heading>
        )}
      </VStack>
    </VStack>
  );
};
