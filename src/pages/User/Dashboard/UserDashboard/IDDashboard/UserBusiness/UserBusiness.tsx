import { Heading } from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import React from "react";
import { FaUserAlt, FaUserFriends, FaUsers } from "react-icons/fa";
import { BalancesCard, CardContainer } from "../../../../../../components";
import { useSupportedNetworkInfo } from "../../../../../../constants";

export const UserBusiness = () => {
  const { chainId, account } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  return (
    <CardContainer>
      <Heading size="sm">Business</Heading>
      <BalancesCard
        currencyName="Self Business"
        currencyValue={`1000 ${currentNetwork?.Native?.Symbol}`}
        icon={FaUserAlt}
      ></BalancesCard>
      <BalancesCard
        currencyName="Direct Business"
        currencyValue={`1000 ${currentNetwork?.Native?.Symbol}`}
        icon={FaUserFriends}
      ></BalancesCard>
      <BalancesCard
        currencyName="Team Business"
        currencyValue={`1000 ${currentNetwork?.Native?.Symbol}`}
        icon={FaUsers}
      ></BalancesCard>
    </CardContainer>
  );
};
