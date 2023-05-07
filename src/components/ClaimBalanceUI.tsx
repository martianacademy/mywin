import {
    Button,
    Heading,
    HStack,
    Modal,
    ModalContent,
    ModalOverlay,
    Text,
    useDisclosure,
    useToast,
    VStack
} from '@chakra-ui/react';
import { useContractFunction, useEthers } from '@usedapp/core';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MyUSDSymbol, useSupportedNetworkInfo } from '../constants';
import { useIDAccount } from '../hooks/ReferralHooks';
import { ModalConfirmTransaction } from './Modals/ModalConfirmTransaction';
import { ModalTransactionInProgress } from './Modals/ModalTransactionInProgress/ModalTransactionInProgress';
import { ModalTransactionSuccess } from './Modals/ModalTransactionSuccess/ModalTransactionSuccess';
import { CardContainer } from './UI';

export const ClaimBalanceUI = () => {
  const { chainId } = useEthers();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  const toast = useToast();
  const { userID } = useParams();
  const IDAccount = useIDAccount(userID ?? '0');

  const [transactionStatus, setTransactionStatus] = useState<
    'No' | 'Loading' | 'Mining' | 'Success'
  >('No');
  const [transactionHash, setTransactionHash] = useState('');

  const {
    send: sendClaimWinningReward,
    state: stateClaimWinningReward,
    resetState: resetStateClaimWinningReward,
  } = useContractFunction(currentNetwork?.referralContractInterface, 'claimBalance');

  const handleTransaction = () => {
    onOpen();
  };

  const proceedTransaction = () => {
    try {
      setTransactionStatus('Loading');
      sendClaimWinningReward(userID?.toString(), {
        value: 0,
      });
    } catch (err) {
      setTransactionStatus('No');
      console.log(err);
    }
  };

  useEffect(() => {
    if (stateClaimWinningReward?.status === 'Exception') {
      toast({
        title: 'Error',
        description: `${stateClaimWinningReward?.errorMessage}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setTransactionStatus('No');
    }

    if (stateClaimWinningReward?.status === 'Mining') {
      setTransactionStatus('Mining');
    }
    if (stateClaimWinningReward?.status === 'Success') {
      setTransactionStatus('Success');
      setTransactionHash(
        stateClaimWinningReward?.receipt?.transactionHash ?? ''
      );
      setTimeout(() => {
        onClose();
        setTransactionStatus('No');
        setTransactionHash('');
        resetStateClaimWinningReward();
      }, 15000);
    }
  }, [stateClaimWinningReward, toast, onClose, resetStateClaimWinningReward]);

  return (
    <>
      <CardContainer>
        <VStack>
          <Heading color="orange.500" size="md">
            Wallet Balance
          </Heading>
          <HStack>
            <Heading size="md" fontWeight={300} fontStyle="italic">
              {IDAccount?.walletBalance?.toFixed(5)}
            </Heading>
            <Heading
              fontWeight={500}
              fontStyle="oblique"
              color="orange.500"
              size="sm"
            >
              {MyUSDSymbol}
            </Heading>
          </HStack>
        </VStack>
        <Button
          px={10}
          h={14}
          borderRadius="xl"
          colorScheme="orange"
          bg="orange.500"
          _hover={{
            bg: 'orange.600',
          }}
          onClick={handleTransaction}
        >
          Convert to {currentNetwork?.Native?.Symbol} & claim
        </Button>
        <VStack w="full" spacing={0}>
          <Text color="red">
            * Min claim amount is $10 {currentNetwork?.MYUSD?.Symbol}.
          </Text>
          <Text color="green">
            * Claim in {currentNetwork?.MYUSD?.Symbol} coming soon...
          </Text>
        </VStack>
      </CardContainer>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          resetStateClaimWinningReward();
        }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent borderRadius="3xl" w="95%">
          {transactionStatus === 'Success' && (
            <ModalTransactionSuccess
              transactionHash={transactionHash}
              onClose={() => {
                onClose();
                setTransactionStatus('No');
                resetStateClaimWinningReward();
              }}
            />
          )}
          {transactionStatus === 'Mining' && <ModalTransactionInProgress />}
          {(transactionStatus === 'No' || transactionStatus === 'Loading') && (
            <ModalConfirmTransaction
              currencyObject={currentNetwork?.MYUSD}
              onClose={() => {
                onClose();
                resetStateClaimWinningReward();
              }}
              isLoading={transactionStatus === 'Loading'}
              value={IDAccount.walletBalance.toFixed(5)}
              onConfirm={proceedTransaction}
              heading="Claim Balance"
              transactionType="Incoming"
            />
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
