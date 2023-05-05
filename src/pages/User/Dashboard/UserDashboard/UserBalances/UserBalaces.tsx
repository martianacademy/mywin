import { Heading } from "@chakra-ui/react";
import { useEtherBalance, useEthers, useTokenBalance } from "@usedapp/core";
import { formatEther } from "ethers/lib/utils";
import { BalancesCard, CardContainer } from "../../../../../components";
import { useSupportedNetworkInfo } from "../../../../../constants";
import { userIDAccountType } from "../../../../../hooks/ReferralHooks";

export const UserBalaces = ({
  idAccountMap,
}: {
  idAccountMap: userIDAccountType;
}) => {
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
        heading="Native Balance"
        currencyValue={Number(formatEther(userNativeBalance ?? 0)).toFixed(5)}
        currencySymbol={currentNetwork?.Native?.Symbol}
        logo={currentNetwork?.Native?.Logo}
      ></BalancesCard>
      <BalancesCard
        heading={`${currentNetwork?.MYUSD?.Symbol} Balance`}
        currencyValue={Number(formatEther(userMYUSDBalance ?? 0)).toFixed(5)}
        currencySymbol={currentNetwork?.MYUSD?.Symbol}
        logo={currentNetwork?.MYUSD?.Logo}
      ></BalancesCard>
      <BalancesCard
        heading={"Wallet Balance"}
        currencyValue={Number(
          idAccountMap.walletBalance
        ).toFixed(5)}
        currencySymbol={currentNetwork?.MYUSD?.Symbol}
        logo={currentNetwork?.MYUSD?.Logo}
      ></BalancesCard>
      {/* <Button colorScheme="twitter" borderRadius="xl">
        Claim Wallet Balance
      </Button> */}
    </CardContainer>
  );
};
