import { Heading } from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import React from "react";
import { BsShieldFillCheck } from "react-icons/bs";
import { GiCube, GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import { BalancesCard, CardContainer } from "../../../../../../components";
import { useSupportedNetworkInfo } from "../../../../../../constants";

export const UserStakings = () => {
  const { chainId, account } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];

  return (
    <CardContainer>
      <Heading size="sm">Stakings</Heading>
      <BalancesCard
        currencyName="Plan Stakings Value"
        currencyValue={`700 ${currentNetwork?.Native?.Symbol}`}
        icon={GiCube}
      ></BalancesCard>
      <BalancesCard
        currencyName="Future Secure"
        currencyValue={`200 ${currentNetwork?.Native?.Symbol}`}
        icon={BsShieldFillCheck}
      ></BalancesCard>
      <BalancesCard
        currencyName="Pending Rewards"
        currencyValue={`70 ${currentNetwork?.Native?.Symbol}`}
        icon={GiPayMoney}
      ></BalancesCard>
      <BalancesCard
        currencyName="Claimed Rewards"
        currencyValue={`10 ${currentNetwork?.Native?.Symbol}`}
        icon={GiReceiveMoney}
      ></BalancesCard>
    </CardContainer>
  );
};
