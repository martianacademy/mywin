import { Heading, Text, VStack } from '@chakra-ui/react'
import { useEthers } from '@usedapp/core';
import { TopUpIDUI } from '../../../components'
import { useCoinPrice } from '../../../hooks/PriceOracleHooks';
import { useMinContributionETH } from '../../../hooks/ReferralHooks';

export const TopUpID = () => {
  const { account, chainId } = useEthers();
  const minContributionETH = useMinContributionETH();
  const coinPrice = useCoinPrice();
  return (
    <VStack w="full" py={10} spacing={10}>
      <Heading>Top Up ID</Heading>
      <TopUpIDUI account={account} chainId={chainId} coinPrice={coinPrice} minContributionETH={minContributionETH}></TopUpIDUI>
    </VStack>
  )
}
