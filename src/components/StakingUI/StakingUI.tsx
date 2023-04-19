import {
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Heading,
  HStack,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useContractFunction, useEtherBalance, useEthers } from "@usedapp/core";
import { utils } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  DefaultReferrer,
  StakingInfo,
  useSupportedNetworkInfo,
} from "../../constants";
import { ModalConfirmTransactionStake } from "../Modals";
import { ModalTransactionInProgress } from "../Modals/ModalTransactionInProgress/ModalTransactionInProgress";
import { ModalTransactionSuccess } from "../Modals/ModalTransactionSuccess/ModalTransactionSuccess";
import { StakingStats } from "../StakingInputStats";
import { ValueSelectButtons } from "../ValueSelectButtons";
import { ReferrerAddressInput } from "./ReferrerAddressInput";

export const StakingUI = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { referrerAddress } = useParams();
  const { account, chainId, error } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  const [input, setInput] = useState<{
    value: string;
    referrer: string;
  }>({
    value: "",
    referrer: referrerAddress ?? "",
  });

  const [transactionStatus, setTransactionStatus] = useState<
    "No" | "Loading" | "Mining" | "Success"
  >("No");

  const [transactionHash, setTransactionHash] = useState("");

  const userETHBalanceWei = useEtherBalance(account);

  const {
    send: sendStake,
    state: stateStake,
    resetState: resetStateStake,
  } = useContractFunction(currentNetwork?.referralContractInterface, "stake");

  const handleInput = (e: any) => {
    setInput((prev) => ({
      ...prev,
      value: e,
    }));
  };

  const handleMaxButton = (perc: number) => {
    setInput((prev) => ({
      ...prev,
      value: (
        (Number(formatEther(userETHBalanceWei ?? 0)) * perc) /
        100
      ).toFixed(5),
    }));
  };

  const handleReferrerInput = (e: any) => {
    setInput((prev) => ({ ...prev, referrer: e.target.value }));
  };

  const handleStake = () => {
    if (input?.referrer.length === 0) {
      toast({
        title: "No referrer address selected.",
        description: "Please enter the referrer address or select default one.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else if (
      Number(formatEther(userETHBalanceWei ?? 0)) < StakingInfo?.minValue
    ) {
      toast({
        title: "Your balance is low.",
        description: "Your balance is less than min staking balance.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else if (input?.value > formatEther(userETHBalanceWei ?? 0)) {
      toast({
        title: "Your balance is low.",
        description: "Please enter the value less or equal to your balance.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else if (Number(input?.value) < StakingInfo?.minValue) {
      toast({
        title: "Value less then min staking value.",
        description: "Please enter the value above min staking value.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      onOpen();
    }
  };

  const proceedSwap = () => {
    try {
      setTransactionStatus("Loading");
      sendStake(input?.referrer, {
        value: utils.parseEther(Number(input.value).toFixed(18)),
      });
    } catch (err) {
      setTransactionStatus("No");
      console.log(err);
    }
  };

  useEffect(() => {
    if (stateStake?.status === "Exception") {
      toast({
        title: "Error",
        description: `${stateStake?.errorMessage}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setTransactionStatus("No");
    }

    if (stateStake?.status === "Mining") {
      setTransactionStatus("Mining");
    }
    if (stateStake?.status === "Success") {
      setTransactionStatus("Success");
      setTransactionHash(stateStake?.receipt?.transactionHash ?? "");
      setTimeout(() => {
        onClose();
        setTransactionStatus("No");
        setTransactionHash("");
        resetStateStake();
      }, 15000);
    }
  }, [stateStake, toast, onClose, resetStateStake]);

  return (
    <VStack
      w="90%"
      maxW={400}
      bgColor={useColorModeValue("white", "gray.900")}
      borderRadius="50px"
      p={5}
      spacing={5}
      borderWidth="thin"
    >
      <Heading size="md">Stake {currentNetwork?.Native?.Symbol}</Heading>
      <Divider />

      <VStack w="full">
        <Input
          h={20}
          placeholder="Please enter valid referrer addresss."
          borderRadius="3xl"
          value={input?.referrer}
          onChange={handleReferrerInput}
          fontSize="xl"
          isReadOnly={referrerAddress ? true : false}
        ></Input>
        <HStack w="full">
          <Button
            size="lg"
            borderRadius="xl"
            colorScheme="red"
            onClick={() => setInput((prev) => ({ ...prev, referrer: "" }))}
            isDisabled={referrerAddress ? true : false}
          >
            Clear
          </Button>
          <Button
            w="full"
            size="lg"
            borderRadius="xl"
            colorScheme="green"
            onClick={() =>
              setInput((prev) => ({ ...prev, referrer: DefaultReferrer }))
            }
            isDisabled={referrerAddress ? true : false}
          >
            Select Default Referrer
          </Button>
        </HStack>
      </VStack>
      <VStack w="full">
        <HStack w="full" justify="space-between">
          <Text>You have</Text>
          <Text>
            {Number(formatEther(userETHBalanceWei ?? 0)).toFixed(3)}{" "}
            {currentNetwork?.Native?.Symbol}
          </Text>
        </HStack>
        <Input
          h={20}
          placeholder="Please enter the value to stake."
          borderRadius="3xl"
          value={input?.value}
          onChange={handleInput}
          fontSize="xl"
          fontStyle="oblique"
        ></Input>
        <ValueSelectButtons
          onClick25={() => handleMaxButton(25)}
          onClick50={() => handleMaxButton(50)}
          onClick75={() => handleMaxButton(75)}
          onClickMax={() => handleMaxButton(100)}
          style={{
            isDisabled: !account,
            size: "lg",
            w: "full",
            borderRadius: "xl",
          }}
        />
      </VStack>

      <Button
        w="full"
        h={20}
        colorScheme="green"
        isDisabled={!account || input?.value?.length === 0}
        onClick={handleStake}
        borderRadius="3xl"
      >
        {account ? " Stake" : "Please connect wallet"}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="3xl" w="95%">
          {transactionStatus === "Success" && (
            <ModalTransactionSuccess
              transactionHash={transactionHash}
              onClose={() => {
                onClose();
                setTransactionStatus("No");
                resetStateStake();
              }}
            />
          )}
          {transactionStatus === "Mining" && <ModalTransactionInProgress />}
          {(transactionStatus === "No" || transactionStatus === "Loading") && (
            <ModalConfirmTransactionStake
              currencySymbol={currentNetwork?.Native?.Symbol}
              onClose={onClose}
              isLoading={transactionStatus === "Loading"}
              value={Number(input?.value).toFixed(3)}
              onConfirm={proceedSwap}
            />
          )}
        </ModalContent>
      </Modal>
    </VStack>
  );
};
