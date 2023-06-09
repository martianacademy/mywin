import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@chakra-ui/icons';
import {
  Button,
  Divider,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spacer,
  StackDivider,
  Tag,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack
} from '@chakra-ui/react';
import {
  useContractFunction,
  useEtherBalance,
  useTokenBalance
} from '@usedapp/core';
import { utils } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  DefaultReferrerID, useSupportedNetworkInfo
} from '../../constants';
import { Logo } from '../Logo/Logo';
import { ModalConfirmTransaction } from '../Modals/ModalConfirmTransaction';
import { ModalTransactionInProgress } from '../Modals/ModalTransactionInProgress/ModalTransactionInProgress';
import { ModalTransactionSuccess } from '../Modals/ModalTransactionSuccess/ModalTransactionSuccess';

const backgrounds = [
  `url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='560' height='185' viewBox='0 0 560 185' fill='none'%3E%3Cellipse cx='102.633' cy='61.0737' rx='102.633' ry='61.0737' fill='%23ED64A6' /%3E%3Cellipse cx='399.573' cy='123.926' rx='102.633' ry='61.0737' fill='%23F56565' /%3E%3Cellipse cx='366.192' cy='73.2292' rx='193.808' ry='73.2292' fill='%2338B2AC' /%3E%3Cellipse cx='222.705' cy='110.585' rx='193.808' ry='73.2292' fill='%23ED8936' /%3E%3C/svg%3E")`,
  `url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='560' height='185' viewBox='0 0 560 185' fill='none'%3E%3Cellipse cx='457.367' cy='123.926' rx='102.633' ry='61.0737' transform='rotate(-180 457.367 123.926)' fill='%23ED8936'/%3E%3Cellipse cx='160.427' cy='61.0737' rx='102.633' ry='61.0737' transform='rotate(-180 160.427 61.0737)' fill='%2348BB78'/%3E%3Cellipse cx='193.808' cy='111.771' rx='193.808' ry='73.2292' transform='rotate(-180 193.808 111.771)' fill='%230BC5EA'/%3E%3Cellipse cx='337.295' cy='74.415' rx='193.808' ry='73.2292' transform='rotate(-180 337.295 74.415)' fill='%23ED64A6'/%3E%3C/svg%3E")`,
  `url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='560' height='185' viewBox='0 0 560 185' fill='none'%3E%3Cellipse cx='102.633' cy='61.0737' rx='102.633' ry='61.0737' fill='%23ED8936'/%3E%3Cellipse cx='399.573' cy='123.926' rx='102.633' ry='61.0737' fill='%2348BB78'/%3E%3Cellipse cx='366.192' cy='73.2292' rx='193.808' ry='73.2292' fill='%230BC5EA'/%3E%3Cellipse cx='222.705' cy='110.585' rx='193.808' ry='73.2292' fill='%23ED64A6'/%3E%3C/svg%3E")`,
  `url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='560' height='185' viewBox='0 0 560 185' fill='none'%3E%3Cellipse cx='457.367' cy='123.926' rx='102.633' ry='61.0737' transform='rotate(-180 457.367 123.926)' fill='%23ECC94B'/%3E%3Cellipse cx='160.427' cy='61.0737' rx='102.633' ry='61.0737' transform='rotate(-180 160.427 61.0737)' fill='%239F7AEA'/%3E%3Cellipse cx='193.808' cy='111.771' rx='193.808' ry='73.2292' transform='rotate(-180 193.808 111.771)' fill='%234299E1'/%3E%3Cellipse cx='337.295' cy='74.415' rx='193.808' ry='73.2292' transform='rotate(-180 337.295 74.415)' fill='%2348BB78'/%3E%3C/svg%3E")`,
];

export const JoinUI = ({
  account,
  chainId,
  minContributionETH,
  coinPrice,
}: {
  account: string | undefined;
  chainId: number | undefined;
  minContributionETH: number;
  coinPrice: number;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenSelectCoin,
    onOpen: onOpenSelectCoin,
    onClose: onCloseSelectCoin,
  } = useDisclosure();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  const toast = useToast();
  const { referrerAddress } = useParams();
  const [input, setInput] = useState<{
    value: string;
    referrer: string;
  }>({
    value: '',
    referrer: referrerAddress ?? '',
  });

  const steps = 0.1;

  const [transactionStatus, setTransactionStatus] = useState<
    'No' | 'Loading' | 'Mining' | 'Success'
  >('No');

  const [transactionHash, setTransactionHash] = useState('');

  const userETHBalanceWei = useEtherBalance(account);
  const userMyUSDBalanceWei = useTokenBalance(
    currentNetwork?.MYUSD?.ContractAddress,
    account
  );

  const errors = {
    valueIncreasingBalance:
      input.value.length > 0 &&
      Number(input?.value ?? 0) > Number(formatEther(userETHBalanceWei ?? 0)),
    balanceLessThanMinContribution:
      Number(formatEther(userETHBalanceWei ?? 0)) < minContributionETH,
    valueLessThanMinContribution:
      input.value.length > 0 && Number(input?.value ?? 0) < minContributionETH,
  };

  const {
    send: sendJoin,
    state: stateJoin,
    resetState: resetStateJoin,
  } = useContractFunction(
    currentNetwork?.referralContractInterface,
    'activateId'
  );

  const handleInput = (e: any) => {
    setInput((prev) => ({
      ...prev,
      value: e.target.value,
    }));
  };

  const handleReferrerInput = (e: any) => {
    setInput((prev) => ({ ...prev, referrer: e.target.value }));
  };

  const handleStake = () => {
   onOpen()
  };

  const proceedSwap = () => {
    try {
      setTransactionStatus('Loading');
      sendJoin(input?.referrer, {
        value: utils.parseEther(input.value),
      });
    } catch (err) {
      setTransactionStatus('No');
      console.log(err);
    }
  };

  useEffect(() => {
    if (stateJoin?.status === 'Exception') {
      toast({
        title: 'Error',
        description: `${stateJoin?.errorMessage}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setTransactionStatus('No');
    }

    if (stateJoin?.status === 'Mining') {
      setTransactionStatus('Mining');
    }
    if (stateJoin?.status === 'Success') {
      setTransactionStatus('Success');
      setTransactionHash(stateJoin?.receipt?.transactionHash ?? '');
      setTimeout(() => {
        onClose();
        setTransactionStatus('No');
        setTransactionHash('');
        resetStateJoin();
      }, 15000);
    }
  }, [stateJoin, toast, onClose, resetStateJoin]);

  return (
    <VStack
      zIndex={1}
      position={'relative'}
      _before={{
        content: '""',
        position: 'absolute',
        zIndex: '-1',
        height: 'full',
        maxW: '640px',
        width: 'full',
        filter: 'blur(40px)',
        backgroundSize: 'cover',
        top: 0,
        left: 0,
        backgroundImage: backgrounds[6 % 4],
      }}
    >
      <VStack
        w="90%"
        maxW={350}
        bgColor={useColorModeValue('white', 'gray.900')}
        borderRadius="50px"
        p={5}
        spacing={5}
        borderWidth="thin"
      >
        <HStack>
          <Heading size="md">Join</Heading>
          <Logo />
        </HStack>
        <Divider />
        <VStack w="full">
          <Input
            h={20}
            placeholder="Please enter valid referrer ID."
            borderRadius="3xl"
            value={input?.referrer}
            onChange={handleReferrerInput}
            isReadOnly={referrerAddress ? true : false}
            isDisabled={errors.balanceLessThanMinContribution}
          ></Input>
          <HStack w="full">
            <Button
              borderRadius="xl"
              colorScheme="red"
              onClick={() => setInput((prev) => ({ ...prev, referrer: '' }))}
              isDisabled={
                referrerAddress
                  ? true
                  : false || errors.balanceLessThanMinContribution
              }
            >
              Clear
            </Button>
            <Button
              w="full"
              borderRadius="xl"
              colorScheme="green"
              onClick={() =>
                setInput((prev) => ({ ...prev, referrer: DefaultReferrerID }))
              }
              isDisabled={
                referrerAddress
                  ? true
                  : false || errors.balanceLessThanMinContribution
              }
            >
              Default Referrer
            </Button>
          </HStack>
        </VStack>
        <VStack w="full">
          <HStack w="full" justify="space-between">
            <Text>You have</Text>
            <Text>
              {Number(formatEther(userETHBalanceWei ?? 0)).toFixed(3)}{' '}
              {currentNetwork?.Native?.Symbol}
            </Text>
          </HStack>
          <HStack w="full">
            <InputGroup>
              <NumberInput
                w="full"
                defaultValue={minContributionETH}
                min={minContributionETH}
                max={Number(formatEther(userETHBalanceWei ?? 0))}
                isDisabled={errors.balanceLessThanMinContribution}
                isInvalid={
                  errors.valueIncreasingBalance ||
                  errors.valueLessThanMinContribution ||
                  errors.balanceLessThanMinContribution
                }
                value={input?.value}
                step={0.1}
                precision={5}
              >
                <NumberInputField
                  placeholder="Please enter the amount."
                  h={20}
                  borderRadius="3xl"
                  onChange={handleInput}
                />

                <InputRightElement
                  h={20}
                  w={20}
                  children={
                    <HStack
                      spacing={0}
                      cursor="pointer"
                      onClick={onOpenSelectCoin}
                    >
                      <Image
                        src={currentNetwork?.Native?.Logo}
                        boxSize={10}
                      ></Image>
                      <Icon as={ChevronDownIcon}></Icon>
                    </HStack>
                  }
                ></InputRightElement>
              </NumberInput>
            </InputGroup>
          </HStack>

          {errors.balanceLessThanMinContribution && (
            <Text color="red" fontWeight={500}>
              * You don't have sufficient balance. You atleast need{' '}
              {minContributionETH.toFixed(3)} {currentNetwork?.Native?.Symbol}{' '}
              to join the network.
            </Text>
          )}

          {errors?.valueLessThanMinContribution && (
            <Text color="red">
              * Value less than min contribution {minContributionETH.toFixed(3)}{' '}
              {currentNetwork?.Native?.Symbol}.
            </Text>
          )}
          {errors?.valueIncreasingBalance && (
            <Text color="red">* Value increasing your balance.</Text>
          )}
          <HStack>
            <Text color="green" fontSize="sm">
              Value In {currentNetwork?.MYUSD?.Symbol}:
            </Text>
            <Tag colorScheme="green" borderRadius="xl">
              {Number(input?.value) > 0
                ? Number(Number(input?.value) * Number(coinPrice)).toFixed(2)
                : 0}{' '}
              {currentNetwork?.MYUSD?.Symbol}
            </Tag>
          </HStack>

          <HStack w="full" spacing={3}>
            <IconButton
              aria-label="Minus Value Button"
              icon={<ChevronLeftIcon />}
              borderRadius="xl"
              onClick={() =>
                setInput((prev) => ({
                  ...prev,
                  value: `${
                    Number(input.value) -
                    (Number(input.value) >= minContributionETH ? steps : 0)
                  }`,
                }))
              }
            ></IconButton>
            <Slider
              onChange={(e) =>
                setInput((prev) => ({
                  ...prev,
                  value: `${
                    (Number(formatEther(userETHBalanceWei ?? 0)) * e) / 100
                  }`,
                }))
              }
              isDisabled={errors.balanceLessThanMinContribution}
              min={
                (minContributionETH /
                  Number(formatEther(userETHBalanceWei ?? 0))) *
                100
              }
              max={99}
              step={steps}
            >
              <SliderTrack bg="orange.100">
                <SliderFilledTrack bg="orange.500" />
              </SliderTrack>
              <SliderThumb boxSize={5} bg="orange.500" />
            </Slider>
            <IconButton
              aria-label="Add Value Button"
              icon={<ChevronRightIcon />}
              borderRadius="xl"
              onClick={() =>
                setInput((prev) => ({
                  ...prev,
                  value: `${
                    Number(input.value) +
                    (Number(input.value) <
                    Number(formatEther(userETHBalanceWei ?? 0))
                      ? steps
                      : 0)
                  }`,
                }))
              }
            ></IconButton>
          </HStack>
        </VStack>
        <Button
          w="full"
          h={20}
          colorScheme="green"
          isDisabled={!account || input?.value?.length === 0}
          onClick={handleStake}
          borderRadius="3xl"
        >
          {account ? 'Join' : 'Please connect wallet'}
        </Button>
        <Text color="red" fontSize="xs" py={5}>
          * For new user joining only. If you want to top up please do from
          dashboard only.
        </Text>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent borderRadius="3xl" w="95%">
            {transactionStatus === 'Success' && (
              <ModalTransactionSuccess
                transactionHash={transactionHash}
                onClose={() => {
                  onClose();
                  setTransactionStatus('No');
                  resetStateJoin();
                }}
              />
            )}
            {transactionStatus === 'Mining' && <ModalTransactionInProgress />}
            {(transactionStatus === 'No' ||
              transactionStatus === 'Loading') && (
              <ModalConfirmTransaction
              heading={`Join MyWin Network`}
                currencyObject={currentNetwork?.Native}
                onClose={() => {
                  onClose();
                  resetStateJoin();
                }}
                isLoading={transactionStatus === 'Loading'}
                value={Number(input?.value).toFixed(3)}
                onConfirm={proceedSwap}
                transactionType="Outgoing"
              />
            )}
          </ModalContent>
        </Modal>
      </VStack>
      <Modal isOpen={isOpenSelectCoin} onClose={onCloseSelectCoin} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="3xl">
          <ModalCloseButton />
          <ModalHeader w="full" textAlign="center">
            Select Coin
          </ModalHeader>
          <ModalBody>
            <VStack divider={<StackDivider />}>
              <HStack w="full" cursor="pointer">
                <Image src={currentNetwork?.Native?.Logo} boxSize={10}></Image>
                <Heading size="sm">{currentNetwork?.Native?.Symbol}</Heading>
                <Spacer />
                <Text>
                  {Number(formatEther(userETHBalanceWei ?? 0)).toFixed(3)}
                </Text>
              </HStack>
              <VStack>
                <HStack w="full" cursor="pointer">
                  <Image src={currentNetwork?.MYUSD?.Logo} boxSize={10}></Image>
                  <Heading size="sm">{currentNetwork?.MYUSD?.Symbol}</Heading>
                  <Spacer />
                  <Text>
                    {Number(formatEther(userMyUSDBalanceWei ?? 0)).toFixed(2)}
                  </Text>
                </HStack>
                <Heading size="sm" color="pink.500">
                  * Get 10% extra reward when your friend joins with MYUSD.
                </Heading>
              </VStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};
