import { Heading } from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import React from "react";
import { FaCrown, FaUsers } from "react-icons/fa";
import { GiCubes } from "react-icons/gi";
import { SiTarget } from "react-icons/si";
import { BalancesCard, CardContainer } from "../../../../../components";
import { useSupportedNetworkInfo } from "../../../../../constants";
import { userIDAccountType } from "../../../../../hooks/ReferralHooks";

export const UserRewards = ({
  idAccountMap,
}: {
  idAccountMap: userIDAccountType;
}) => {
  const { chainId } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  return (
    <CardContainer>
      <Heading size="sm">Rewards</Heading>
      <BalancesCard
        heading="Referral Rewards"
        currencyValue={idAccountMap.referralPaid.toFixed(2)}
        currencySymbol={currentNetwork?.MYUSD?.Symbol}
        icon={FaUsers}
      ></BalancesCard>
      <BalancesCard
        heading="Royalty Rewards"
        currencyValue={idAccountMap.rewardPaidRoyaltyClub.toFixed(2)}
        currencySymbol={currentNetwork?.MYUSD?.Symbol}
        icon={FaCrown}
      ></BalancesCard>
      <BalancesCard
        heading="Winning Rewards"
        currencyValue={idAccountMap.roiClaimed.toFixed(2)}
        currencySymbol={currentNetwork?.MYUSD?.Symbol}
        icon={GiCubes}
      ></BalancesCard>
    </CardContainer>
  );
};
