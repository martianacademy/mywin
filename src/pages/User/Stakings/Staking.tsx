import { Button, Heading, HStack, Image, VStack } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { CardContainer } from "../../../components";
import { MyUSDLogo, MyUSDSymbol } from "../../../constants";
import {
  useIDAccount
} from "../../../hooks/ReferralHooks";
import { useGetUserAllActiveROIValue, useGetUserIDTotalROI } from "../../../hooks/ROIHooks";

export const Staking = () => {
  const { userID } = useParams();
  const userTotalValueLocked = useGetUserAllActiveROIValue(userID);
  const IDAccount = useIDAccount(userID ?? "0");
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
              {IDAccount?.roiPaid?.toFixed(2)}
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
