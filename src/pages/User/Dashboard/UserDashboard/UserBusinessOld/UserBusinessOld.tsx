import { Heading } from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import React from "react";
import { FaUserAlt, FaUserFriends, FaUsers } from "react-icons/fa";
import { BalancesCard, CardContainer } from "../../../../../components";
import { useSupportedNetworkInfo } from "../../../../../constants";
import { userIDAccountType } from "../../../../../hooks/ReferralHooks";

export const UserBusinessOld = ({
  idAccountMap,
}: {
  idAccountMap: userIDAccountType;
}) => {
  const { chainId } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  return (
    <CardContainer>
      <Heading size="sm">Business Old</Heading>
      <BalancesCard
        heading="Self Business Old"
        currencyValue={idAccountMap?.selfBusinessUSDOld.toFixed(2)}
        currencySymbol={currentNetwork?.MYUSD?.Symbol}
        icon={FaUserAlt}
      ></BalancesCard>
      <BalancesCard
        heading="Direct Business Old"
        currencyValue={idAccountMap?.directBusinessUSDOld.toFixed(2)}
        currencySymbol={currentNetwork?.MYUSD?.Symbol}
        icon={FaUserFriends}
      ></BalancesCard>
      <BalancesCard
        heading="Team Business Old"
        currencyValue={idAccountMap?.teamBusinessUSDOld.toFixed(2)}
        currencySymbol={currentNetwork?.MYUSD?.Symbol}
        icon={FaUsers}
      ></BalancesCard>
    </CardContainer>
  );
};
