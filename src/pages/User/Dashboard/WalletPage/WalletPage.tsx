import { Heading, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { ClaimBalanceUI } from '../../../../components'

export const WalletPage = () => {
  return (
    <VStack w="fll" py={10} spacing={10}>
      <Heading>Walet Balance</Heading>
      <ClaimBalanceUI/>
    </VStack>
  )
}
