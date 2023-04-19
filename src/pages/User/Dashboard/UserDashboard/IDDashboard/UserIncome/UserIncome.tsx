import { Heading } from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import React from "react";
import { FaCrown, FaUsers } from "react-icons/fa";
import { GiCubes } from "react-icons/gi";
import { SiTarget } from "react-icons/si";
import { BalancesCard, CardContainer } from "../../../../../../components";
import { useSupportedNetworkInfo } from "../../../../../../constants";

export const UserIncome = () => {
  const { chainId, account } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  return (
    <CardContainer>
      <Heading size="sm">Rewards</Heading>
      <BalancesCard
        currencyName="Referral Rewards"
        currencyValue={`1000 ${currentNetwork?.Native?.Symbol}`}
        icon={FaUsers}
      ></BalancesCard>
      <BalancesCard
        currencyName="Royalty Club Rewards"
        currencyValue={`1000 ${currentNetwork?.Native?.Symbol}`}
        icon={FaCrown}
      ></BalancesCard>
      <BalancesCard
        currencyName="Target Reward"
        currencyValue={`1000 ${currentNetwork?.Native?.Symbol}`}
        icon={SiTarget}
      ></BalancesCard>
      <BalancesCard
        currencyName="Staking Reward"
        currencyValue={`1000 ${currentNetwork?.Native?.Symbol}`}
        icon={GiCubes}
      ></BalancesCard>
    </CardContainer>
  );
};
