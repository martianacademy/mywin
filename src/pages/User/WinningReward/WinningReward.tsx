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
import { CardContainer } from '../../../components';
import { ModalConfirmTransaction } from '../../../components/Modals/ModalConfirmTransaction';
import { ModalTransactionInProgress } from '../../../components/Modals/ModalTransactionInProgress/ModalTransactionInProgress';
import { ModalTransactionSuccess } from '../../../components/Modals/ModalTransactionSuccess/ModalTransactionSuccess';
import {
  MyUSDLogo,
  MyUSDSymbol,
  useSupportedNetworkInfo
} from '../../../constants';
import { useIDAccount } from '../../../hooks/ReferralHooks';
import {
  useGetUserAllActiveROIValue,
  useGetUserIDTotalROI
} from '../../../hooks/ROIHooks';

export const WinningReward = () => {
  const { chainId } = useEthers();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  const toast = useToast();
  const { userID } = useParams();
  const userTotalValueLocked = useGetUserAllActiveROIValue(userID);
  const IDAccount = useIDAccount(userID ?? '0');
  const liveROI = useGetUserIDTotalROI(userID);

  const [transactionStatus, setTransactionStatus] = useState<
    'No' | 'Loading' | 'Mining' | 'Success'
  >('No');
  const [transactionHash, setTransactionHash] = useState('');

  const {
    send: sendClaimWinningReward,
    state: stateClaimWinningReward,
    resetState: resetStateClaimWinningReward,
  } = useContractFunction(
    currentNetwork?.roiContractInterface,
    'claimROI'
  );

  const handleTransaction = () => {
    onOpen();
  };

  const proceedTransaction = () => {
    try {
      setTransactionStatus('Loading');
      sendClaimWinningReward(userID?.toString(), {
        value: 0
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
      <VStack py={[3, 5, 7, 10]} spacing={5}>
        <Heading textAlign="center">Winning Rewards Stats</Heading>
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
          {/* <VStack>
          <Heading color="orange.500" size="md">
            Max Duration
          </Heading>
          <Counter timeinseconds={roiEndTimeInSeconds} size="sm"></Counter>
        </VStack> */}
          <VStack>
            <Heading color="orange.500" size="md">
              Reward Claimed
            </Heading>
            <HStack>
              <Heading size="md" fontWeight={300} fontStyle="italic">
                {IDAccount?.roiPaid?.toFixed(5)}
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
                {liveROI}
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
            Claim Winning Reward
          </Button>
        </CardContainer>
      </VStack>

      <Modal isOpen={isOpen} onClose={() => {
        onClose();
        resetStateClaimWinningReward();
      }} isCentered>
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
              value={Number(liveROI).toFixed(5)}
              onConfirm={proceedTransaction}
              heading="Claim ROI"
            />
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
