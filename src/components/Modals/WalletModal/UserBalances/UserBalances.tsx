import { VStack } from "@chakra-ui/react";
import { useEtherBalance, useEthers, useTokenBalance } from "@usedapp/core";
import { utils } from "ethers";
import React from "react";
import { useSupportedNetworkInfo } from "../../../../constants";
import { BalancesCard } from "../../../UI";

export const UserBalances = () => {
  const { chainId, account } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  const userNativeBalanceWei = useEtherBalance(account);

  const userMYUSDBalance = useTokenBalance(
    currentNetwork?.MYUSD?.ContractAddress,
    account
  );
  return (
    <VStack w="full">
      <BalancesCard
        currencyName={currentNetwork?.Native?.Symbol}
        currencyValue={utils.formatUnits(
          userNativeBalanceWei ?? 0,
          currentNetwork?.Native?.Decimals
        )}
        logo={currentNetwork?.Native?.Logo}
      ></BalancesCard>
      <BalancesCard
        currencyName={currentNetwork?.MYUSD?.Symbol}
        currencyValue={utils.formatUnits(
          userMYUSDBalance ?? 0,
          currentNetwork?.MYUSD?.Decimals
        )}
        logo={currentNetwork?.MYUSD?.Logo}
      ></BalancesCard>
    </VStack>
  );
};
