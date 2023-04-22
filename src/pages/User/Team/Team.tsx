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
  const [id, setId] = useState(userIDAccount.id);
  return (
    <VStack py={10} px={5} spacing={10}>
      <Heading>Your Team Object</Heading>
      {userIDAccount.refererID && (
        <VStack spacing={10}>
          <UserReferralCard
            heading="Referrer"
            icon={FaUserAstronaut}
            id={userIDAccount?.refererID}
            scale={0.8}
          ></UserReferralCard>
          <Icon as={FaArrowDown} boxSize={10}></Icon>
        </VStack>
      )}
      <UserReferralCard
        heading="Your"
        icon={FaUserCheck}
        id={userIDAccount?.id}
      ></UserReferralCard>
      <Icon as={FaArrowDown} boxSize={10}></Icon>
      <Wrap align="center" justify="center">
        {userIDAccount?.refereeIDs ? (
          <VStack>
            {userIDAccount?.refereeIDs.map((id: string, key: number) => {
              return (
                <UserReferralCard
                  heading="Team"
                  icon={HiUsers}
                  id={id}
                  scale={0.8}
                ></UserReferralCard>
              );
            })}
          </VStack>
        ) : (
          <Heading>You have no referee</Heading>
        )}
      </Wrap>
    </VStack>
  );
};
