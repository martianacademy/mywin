import { Heading, VStack, Wrap } from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { useNavigate, useParams } from "react-router-dom";
import { UserIDCardDashboard } from "../../../components";
import { useReferralAccountMap } from "../../../hooks/ReferralHooks";

export const UserIDDisplay = () => {
  const { account } = useEthers();
  const {userAddress} = useParams();
  const referralAccount = useReferralAccountMap(userAddress ?? account!);
  const navigate = useNavigate();

  return (
    <VStack w="full" p={5} spacing={10}>
      {!referralAccount?.accountIds.length ? (
        <Heading color="red">Your account is not active yet.</Heading>
      ) : (
        <>
          <Heading>Your IDs</Heading>
          <Wrap w="full" justify="center" p={5} spacing={10} overflow="visible">
            {referralAccount?.accountIds.map((id: string, key: number) => {
              return (
                <VStack onClick={() => navigate(`/user/dashboard/${id}`)} key={key}>
                  <UserIDCardDashboard id={`${id}`}></UserIDCardDashboard>
                </VStack>
              );
            })}
          </Wrap>
        </>
      )}
    </VStack>
  );
};
