import {
  Button,
  Divider,
  Heading,
  HStack,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
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
  DefaultReferrerID,
  StakingInfo,
  useSupportedNetworkInfo,
} from "../../constants";
import { Logo } from "../Logo/Logo";
import { ModalConfirmTransactionStake } from "../Modals";
import { ModalTransactionInProgress } from "../Modals/ModalTransactionInProgress/ModalTransactionInProgress";
import { ModalTransactionSuccess } from "../Modals/ModalTransactionSuccess/ModalTransactionSuccess";

const backgrounds = [
  `url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='560' height='185' viewBox='0 0 560 185' fill='none'%3E%3Cellipse cx='102.633' cy='61.0737' rx='102.633' ry='61.0737' fill='%23ED64A6' /%3E%3Cellipse cx='399.573' cy='123.926' rx='102.633' ry='61.0737' fill='%23F56565' /%3E%3Cellipse cx='366.192' cy='73.2292' rx='193.808' ry='73.2292' fill='%2338B2AC' /%3E%3Cellipse cx='222.705' cy='110.585' rx='193.808' ry='73.2292' fill='%23ED8936' /%3E%3C/svg%3E")`,
  `url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='560' height='185' viewBox='0 0 560 185' fill='none'%3E%3Cellipse cx='457.367' cy='123.926' rx='102.633' ry='61.0737' transform='rotate(-180 457.367 123.926)' fill='%23ED8936'/%3E%3Cellipse cx='160.427' cy='61.0737' rx='102.633' ry='61.0737' transform='rotate(-180 160.427 61.0737)' fill='%2348BB78'/%3E%3Cellipse cx='193.808' cy='111.771' rx='193.808' ry='73.2292' transform='rotate(-180 193.808 111.771)' fill='%230BC5EA'/%3E%3Cellipse cx='337.295' cy='74.415' rx='193.808' ry='73.2292' transform='rotate(-180 337.295 74.415)' fill='%23ED64A6'/%3E%3C/svg%3E")`,
  `url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='560' height='185' viewBox='0 0 560 185' fill='none'%3E%3Cellipse cx='102.633' cy='61.0737' rx='102.633' ry='61.0737' fill='%23ED8936'/%3E%3Cellipse cx='399.573' cy='123.926' rx='102.633' ry='61.0737' fill='%2348BB78'/%3E%3Cellipse cx='366.192' cy='73.2292' rx='193.808' ry='73.2292' fill='%230BC5EA'/%3E%3Cellipse cx='222.705' cy='110.585' rx='193.808' ry='73.2292' fill='%23ED64A6'/%3E%3C/svg%3E")`,
  `url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='560' height='185' viewBox='0 0 560 185' fill='none'%3E%3Cellipse cx='457.367' cy='123.926' rx='102.633' ry='61.0737' transform='rotate(-180 457.367 123.926)' fill='%23ECC94B'/%3E%3Cellipse cx='160.427' cy='61.0737' rx='102.633' ry='61.0737' transform='rotate(-180 160.427 61.0737)' fill='%239F7AEA'/%3E%3Cellipse cx='193.808' cy='111.771' rx='193.808' ry='73.2292' transform='rotate(-180 193.808 111.771)' fill='%234299E1'/%3E%3Cellipse cx='337.295' cy='74.415' rx='193.808' ry='73.2292' transform='rotate(-180 337.295 74.415)' fill='%2348BB78'/%3E%3C/svg%3E")`,
];

export const JoinUI = () => {
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
    send: sendJoin,
    state: stateJoin,
    resetState: resetStateJoin,
  } = useContractFunction(
    currentNetwork?.referralContractInterface,
    "activateID"
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
      sendJoin(input?.referrer, {
        value: utils.parseEther(input.value),
      });
    } catch (err) {
      setTransactionStatus("No");
      console.log(err);
    }
  };

  useEffect(() => {
    if (stateJoin?.status === "Exception") {
      toast({
        title: "Error",
        description: `${stateJoin?.errorMessage}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setTransactionStatus("No");
    }

    if (stateJoin?.status === "Mining") {
      setTransactionStatus("Mining");
    }
    if (stateJoin?.status === "Success") {
      setTransactionStatus("Success");
      setTransactionHash(stateJoin?.receipt?.transactionHash ?? "");
      setTimeout(() => {
        onClose();
        setTransactionStatus("No");
        setTransactionHash("");
        resetStateJoin();
      }, 15000);
    }
  }, [stateJoin, toast, onClose, resetStateJoin]);

  return (
    <VStack
      zIndex={1}
      position={"relative"}
      _before={{
        content: '""',
        position: "absolute",
        zIndex: "-1",
        height: "full",
        maxW: "640px",
        width: "full",
        filter: "blur(40px)",
        backgroundSize: "cover",
        top: 0,
        left: 0,
        backgroundImage: backgrounds[6 % 4],
      }}
    >
      <VStack
        w="90%"
        maxW={350}
        bgColor={useColorModeValue("white", "gray.900")}
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
                setInput((prev) => ({ ...prev, referrer: DefaultReferrerID }))
              }
              isDisabled={referrerAddress ? true : false}
            >
              Default Referrer
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
          <HStack w="full" spacing={3}>
            <Button borderRadius="xl">Min</Button>
            <Slider onChange={(e) => console.log(e)}>
              <SliderTrack bg="orange.100">
                <SliderFilledTrack bg="orange.500" />
              </SliderTrack>
              <SliderThumb boxSize={6} bg="orange.500" />
            </Slider>
            <Button borderRadius="xl">Max</Button>
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
          {account ? " Stake" : "Please connect wallet"}
        </Button>
        <Text color="red" fontSize="xs" py={5}>* For new user joining only. If you want to top up please do from dashboard only.</Text>

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent borderRadius="3xl" w="95%">
            {transactionStatus === "Success" && (
              <ModalTransactionSuccess
                transactionHash={transactionHash}
                onClose={() => {
                  onClose();
                  setTransactionStatus("No");
                  resetStateJoin();
                }}
              />
            )}
            {transactionStatus === "Mining" && <ModalTransactionInProgress />}
            {(transactionStatus === "No" ||
              transactionStatus === "Loading") && (
              <ModalConfirmTransactionStake
                currencySymbol={currentNetwork?.Native?.Symbol}
                onClose={() => {
                  onClose();
                  resetStateJoin();
                }}
                isLoading={transactionStatus === "Loading"}
                value={Number(input?.value).toFixed(3)}
                onConfirm={proceedSwap}
              />
            )}
          </ModalContent>
        </Modal>
      </VStack>
    </VStack>
  );
};
