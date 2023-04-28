import { Heading, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { TopUpIDUI } from '../../../components'

export const TopUpID = () => {
  return (
    <VStack w="full" py={10} spacing={10}>
      <Heading>Top Up ID</Heading>
      <TopUpIDUI></TopUpIDUI>
    </VStack>
  )
}
