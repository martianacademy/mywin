import { Button, Heading, HStack, Tag, Text, VStack } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { Counter } from "../../../components/Counter";
import { MyUSDSymbol } from "../../../constants";
import {
  useGetUserAllActiveROIValue,
  useGetUserIDTotalROI,
  useIDAccount,
  useROIAccount,
} from "../../../hooks/ReferralHooks";

export const Staking = () => {
  const { userID } = useParams();
  const userTotalValueLocked = useGetUserAllActiveROIValue(userID);
  const IDAccount = useIDAccount(userID);

  const roiIDs =
    IDAccount.roiIDs?.[
      Number(IDAccount.roiIDs?.length) > 0
        ? Number(IDAccount.roiIDs?.length) - 1
        : 0
    ];
  const roiAccount = useROIAccount(roiIDs);
  const roiEndTimeInSeconds = roiAccount?.startTime + roiAccount?.duration;

  const liveROI = useGetUserIDTotalROI(userID);

  console.log(roiAccount);
  return (
    <VStack w="full" py={10} spacing={10} px={5}>
      <Heading textAlign="center">Winning Rewards Stats</Heading>
      <Heading textAlign="center" size="md">
        Total Value Locked For Winning Rewards
      </Heading>
      <Tag p={3} borderRadius="3xl">
        <HStack>
          <Heading size="lg">{userTotalValueLocked}</Heading>
          <Heading
            fontWeight={500}
            fontStyle="oblique"
            color="pink.500"
            size="lg"
          >
            {MyUSDSymbol}
          </Heading>
        </HStack>
      </Tag>
      <Counter timeinseconds={roiEndTimeInSeconds}></Counter>
      <Heading textAlign="center">Live Winning Rewards</Heading>
      <HStack>
        <Heading size="md">{liveROI}</Heading>
        <Heading
          fontWeight={500}
          fontStyle="oblique"
          color="pink.500"
          size="lg"
        >
          {MyUSDSymbol}
        </Heading>
      </HStack>
      <Button
        px={10}
        h={14}
        borderRadius="xl"
        colorScheme="pink"
        bg="pink.500"
        _hover={{
          bg: "pink.600",
        }}
      >
        Claim Winning Reward
      </Button>
    </VStack>
  );
};
