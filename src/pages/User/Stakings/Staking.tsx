import { Button, Heading, HStack, Image, VStack } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { CardContainer } from "../../../components";
import { Counter } from "../../../components/Counter";
import { MyUSDLogo, MyUSDSymbol } from "../../../constants";
import {
  useGetUserAllActiveROIValue,
  useGetUserIDTotalROI,
  useIDAccount,
  useROIAccount,
} from "../../../hooks/ReferralHooks";

export const Staking = () => {
  const { userID } = useParams();
  const userTotalValueLocked = useGetUserAllActiveROIValue(userID);
  console.log(userTotalValueLocked);
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
  return (
    <VStack py={[3, 5, 7, 10]} spacing={5}>
      <Heading textAlign="center">Winning Rewards Stats</Heading>
      <CardContainer>
        <VStack>
          <Heading textAlign="center" color="orange.500" size="md">
            Value Locked
          </Heading>
          <HStack>
            <Heading size="md" fontWeight={300} fontStyle="italic">
              {userTotalValueLocked}
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
            Max Duration
          </Heading>
          <Counter timeinseconds={roiEndTimeInSeconds} size="sm"></Counter>
        </VStack>
        <VStack>
          <Heading color="orange.500" size="md">
            Reward Claimed
          </Heading>
          <HStack>
            <Heading size="md" fontWeight={300} fontStyle="italic">
              {IDAccount?.roiClaimedUSD}
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
            bg: "orange.600",
          }}
        >
          Claim Winning Reward
        </Button>
      </CardContainer>
    </VStack>
  );
};
