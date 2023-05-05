import { Heading, VStack } from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { Counter } from "../../components/Counter";
import { JoinUI } from "../../components/JoinUI/JoinUI";
import { useCoinPrice } from "../../hooks/PriceOracleHooks";
import { useMinContributionETH } from "../../hooks/ReferralHooks";

export const JoinPage = () => {
  const { account, chainId } = useEthers();
  const minContributionETH = useMinContributionETH();
  const coinPrice = useCoinPrice();
  return (
    <VStack w="full" flex={1} py={50}>
      {/* <JoinUI account={account} chainId={chainId} minContributionETH={minContributionETH} coinPrice={coinPrice}></JoinUI> */}
      <Heading>System is under maintainance</Heading>
      <Counter timeinseconds={1683309600}></Counter>
    </VStack>
  );
};
