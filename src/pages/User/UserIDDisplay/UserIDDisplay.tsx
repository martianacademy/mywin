import { Heading, VStack, Wrap } from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { useNavigate, useParams } from "react-router-dom";
import { UserIDCardDashboard } from "../../../components";
import { useReferralAccountMap } from "../../../hooks/ReferralHooks";
import { useVariablesIsAdmin } from "../../../hooks/VariablesHooks";

export const UserIDDisplay = () => {
  const { account } = useEthers();
  const {userAddress} = useParams();
  const referralAccount = useReferralAccountMap(userAddress ?? account!);
  const navigate = useNavigate();
  const isAdmin  = useVariablesIsAdmin(account);

  return (
    <VStack w="full" p={5} spacing={10}>
      {((!referralAccount.isActive || !referralAccount?.accountIds.length) && !isAdmin) ? (
        <Heading color="red">Your account is not active yet.</Heading>
      ) : (
        <>
          <Heading>Your IDs</Heading>
          <Wrap w="full" justify="center" p={5} spacing={10} overflow="visible">
            {referralAccount?.accountIds.map((id: string, key: number) => {
              return (
                <VStack onClick={() => navigate(`/user/info/dashboard/${id}`)} key={key}>
                  <UserIDCardDashboard id={`${id}`} isAdmin={isAdmin} userAddress={userAddress}></UserIDCardDashboard>
                </VStack>
              );
            })}
          </Wrap>
        </>
      )}
    </VStack>
  );
};
