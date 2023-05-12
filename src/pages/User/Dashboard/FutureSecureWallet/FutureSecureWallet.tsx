import {
  Button,
  Heading,
  HStack,
  Image,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  useToast,
  VStack
} from '@chakra-ui/react';
import { useContractFunction, useEthers } from '@usedapp/core';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CardContainer } from '../../../../components';
import { Counter } from '../../../../components/Counter';
import { ModalConfirmTransaction } from '../../../../components/Modals/ModalConfirmTransaction';
import { ModalTransactionInProgress } from '../../../../components/Modals/ModalTransactionInProgress/ModalTransactionInProgress';
import { ModalTransactionSuccess } from '../../../../components/Modals/ModalTransactionSuccess/ModalTransactionSuccess';
import {
  MyUSDLogo,
  MyUSDSymbol,
  useSupportedNetworkInfo
} from '../../../../constants';
import { useFutureGetStakingTimeEndTime, useFutureGetUserAllStakingsRewards, useFutureGetUserTotalRewardClaimedToken, useFutureGetUserTotalValueStaked } from '../../../../hooks/FutureSecureWalletHooks';
import { useIDAccount } from '../../../../hooks/ReferralHooks';

export const FutureSecureWallet = () => {
  const { chainId } = useEthers();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  const toast = useToast();
  const { userID } = useParams();
  const IDAccount = useIDAccount(userID ?? '0');
  const userTotalValueLocked = useFutureGetUserTotalValueStaked(IDAccount?.owner);
  const liveROI = useFutureGetUserAllStakingsRewards(IDAccount?.owner);
  const totalRewardClaimed = useFutureGetUserTotalRewardClaimedToken(IDAccount?.owner);
  const stakingEndTime = useFutureGetStakingTimeEndTime(IDAccount?.owner);

  const [transactionStatus, setTransactionStatus] = useState<
    'No' | 'Loading' | 'Mining' | 'Success'
  >('No');
  const [transactionHash, setTransactionHash] = useState('');

  const {
    send: sendClaimFutureStakingReward,
    state: stateClaimFutureStakingReward,
    resetState: resetStateClaimFutureStakingReward,
  } = useContractFunction(
    currentNetwork?.futureSecureWalletContractInterface,
    'claimStakingReward'
  );

  const handleTransaction = () => {
    onOpen();
  };

  const proceedTransaction = () => {
    try {
      setTransactionStatus('Loading');
      sendClaimFutureStakingReward({
        value: 0
      });
    } catch (err) {
      setTransactionStatus('No');
      console.log(err);
    }
  };

  useEffect(() => {
    if (stateClaimFutureStakingReward?.status === 'Exception') {
      toast({
        title: 'Error',
        description: `${stateClaimFutureStakingReward?.errorMessage}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setTransactionStatus('No');
    }

    if (stateClaimFutureStakingReward?.status === 'Mining') {
      setTransactionStatus('Mining');
    }
    if (stateClaimFutureStakingReward?.status === 'Success') {
      setTransactionStatus('Success');
      setTransactionHash(
        stateClaimFutureStakingReward?.receipt?.transactionHash ?? ''
      );
      setTimeout(() => {
        onClose();
        setTransactionStatus('No');
        setTransactionHash('');
        resetStateClaimFutureStakingReward();
      }, 15000);
    }
  }, [stateClaimFutureStakingReward, toast, onClose, resetStateClaimFutureStakingReward]);


  return (
    <>
      <VStack py={[3, 5, 7, 10]} spacing={5}>
        <Heading textAlign="center">Future Secure Wallet</Heading>
        <CardContainer>
          <VStack>
            <Heading textAlign="center" color="orange.500" size="md">
              Value Locked
            </Heading>
            <HStack>
              <Heading size="md" fontWeight={300} fontStyle="italic">
                {userTotalValueLocked?.toFixed(2)}
              </Heading>

              <Heading
                fontWeight={500}
                fontStyle="oblique"
                color="orange.500"
                size="md"
              >
                {MyUSDSymbol}
              </Heading>
              <Image src={MyUSDLogo} boxSize={10}></Image>
            </HStack>
          </VStack>
          <VStack>
          <Heading color="orange.500" size="md">
            Wallet Unlock Time
          </Heading>
          <Counter timeinseconds={stakingEndTime} size="sm"></Counter>
        </VStack>
          <VStack>
            <Heading color="orange.500" size="md">
              Reward Claimed
            </Heading>
            <HStack>
              <Heading size="md" fontWeight={300} fontStyle="italic">
                {totalRewardClaimed?.toFixed(5)}
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
          <VStack>
            <Heading textAlign="center" color="orange.500" size="md">
              Pending Rewards
            </Heading>
            <HStack>
              <Heading size="md" fontWeight={300} fontStyle="italic">
                {liveROI?.toFixed(12)}
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
            Claim Reward
          </Button>
        </CardContainer>
      </VStack>

      <Modal isOpen={isOpen} onClose={() => {
        onClose();
        resetStateClaimFutureStakingReward();
      }} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="3xl" w="95%">
          {transactionStatus === 'Success' && (
            <ModalTransactionSuccess
              transactionHash={transactionHash}
              onClose={() => {
                onClose();
                setTransactionStatus('No');
                resetStateClaimFutureStakingReward();
              }}
            />
          )}
          {transactionStatus === 'Mining' && <ModalTransactionInProgress />}
          {(transactionStatus === 'No' || transactionStatus === 'Loading') && (
            <ModalConfirmTransaction
            currencyObject={currentNetwork?.MYUSD}
              onClose={() => {
                onClose();
                resetStateClaimFutureStakingReward();
                setTransactionStatus("No")
              }}
              isLoading={transactionStatus === 'Loading'}
              value={Number(liveROI).toFixed(5)}
              onConfirm={proceedTransaction}
              heading="Claim Future Staking Reward"
            />
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
