import { Heading } from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import React from "react";
import { FaUserAlt, FaUserFriends, FaUsers } from "react-icons/fa";
import { BalancesCard, CardContainer } from "../../../../../components";
import { useSupportedNetworkInfo } from "../../../../../constants";
import { userIDAccountType } from "../../../../../hooks/ReferralHooks";

export const UserBusiness = ({
  idAccountMap,
}: {
  idAccountMap: userIDAccountType;
}) => {
  const { chainId } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  return (
    <CardContainer>
      <Heading size="sm">Business</Heading>

      <BalancesCard
        heading="Self Business"
        currencyValue={Number(
          idAccountMap?.selfBusinessUSD + idAccountMap?.selfBusinessUSDOld
        ).toFixed(2)}
        currencySymbol={currentNetwork?.MYUSD?.Symbol}
        icon={FaUserAlt}
      ></BalancesCard>

      <BalancesCard
        heading="Direct Business"
        currencyValue={Number(
          idAccountMap?.directBusinessUSD + idAccountMap?.directBusinessUSDOld
        ).toFixed(2)}
        currencySymbol={currentNetwork?.MYUSD?.Symbol}
        icon={FaUserFriends}
      ></BalancesCard>

      <BalancesCard
        heading="Team Business"
        currencyValue={Number(
          idAccountMap?.teamBusinessUSD + idAccountMap?.teamBusinessUSDOld
        ).toFixed(2)}
        currencySymbol={currentNetwork?.MYUSD?.Symbol}
        icon={FaUsers}
      ></BalancesCard>
    </CardContainer>
  );
};
