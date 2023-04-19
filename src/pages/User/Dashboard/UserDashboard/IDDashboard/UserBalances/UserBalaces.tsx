import { Heading } from "@chakra-ui/react";
import { useEtherBalance, useEthers, useTokenBalance } from "@usedapp/core";
import { formatEther } from "ethers/lib/utils";
import React from "react";
import { BalancesCard, CardContainer } from "../../../../../../components";
import { useSupportedNetworkInfo } from "../../../../../../constants";

export const UserBalaces = () => {
  const { chainId, account } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  const userNativeBalance = useEtherBalance(account);
  const userMYUSDBalance = useTokenBalance(
    currentNetwork?.MYUSD?.ContractAddress,
    account
  );
  return (
    <CardContainer>
      <Heading size="sm">Balances</Heading>
      <BalancesCard
        currencyName={currentNetwork?.Native?.Symbol}
        currencyValue={Number(formatEther(userNativeBalance ?? 0)).toFixed(3)}
        logo={currentNetwork?.Native?.Logo}
      ></BalancesCard>
      <BalancesCard
        currencyName={currentNetwork?.MYUSD?.Symbol}
        currencyValue={Number(formatEther(userMYUSDBalance ?? 0)).toFixed(3)}
        logo={currentNetwork?.MYUSD?.Logo}
      ></BalancesCard>
      <BalancesCard
        currencyName={"Wallet Balance"}
        currencyValue={Number(formatEther(userMYUSDBalance ?? 0)).toFixed(3)}
        logo={currentNetwork?.MYUSD?.Logo}
      ></BalancesCard>
    </CardContainer>
  );
};
