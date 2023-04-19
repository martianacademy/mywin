import { useCall, useEthers } from "@usedapp/core";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { AddressZero, useSupportedNetworkInfo } from "../constants";

const useCallHook = (methodName: string, arg: any[]) => {
  const { chainId } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  const { value, error } =
    useCall(
      currentNetwork?.referralContractAddress && {
        contract: currentNetwork?.referralContractInterface,
        method: methodName,
        args: arg,
      }
    ) ?? {};

  if (error) {
    console.error("Referral Hooks", error.message);
    return undefined;
  }
  return value;
};

export const useReferralAccountMap = (
  address: string
): {
  isDisabled: boolean;
  accountInfoArray: number[];
} => {
  const value = useCallHook("getUserAccount", [address]);
  const valueObject = {
    isDisabled: value ? value?.[0].isDisabled : false,
    accountInfoArray: value ? value?.[0].accountInfoArray : [],
  };
  return valueObject;
};

export interface userIDAccountType {
  id: number;
  owner: string;
  refereeIDs: string[] | [];
  refererID: number;
  isDisabled: boolean;
  activationTime: number;
  roiIDs: string[] | [];
  roiClaimTimestamp: number;
  roiClaimedUSD: number;
  selfBusinessUSDArray: BigNumber[] | [];
  selfBusinessUSD: number;
  directBusinessUSD: number;
  teamBusinessUSD: number;
  teamIDs: string[] | [];
  balanceClaimedUSD: number;
  limitBalanceUSD: number;
  maxLimitAmount: number;
  referralPaidUSD: number;
  rewardPaidRoyaltyClubUSD: number;
  royaltyClubBusinessUSD: number;
  royaltyClubListIndex: number;
  royaltyClubPackageID: number;
  timeStampRoyaltyClub: number;
}

export const useIDAccountMap = (id: string): userIDAccountType => {
  const value = useCallHook("getIDAccount", [id]);
  const valueObject = {
    id: value ? Number(value?.[0].id.toString()) : 0,
    owner: value ? value?.[0].owner : AddressZero,
    refereeIDs: value ? value?.[0].refereeIDs : [],
    refererID: value ? Number(value?.[0].refererID.toString()) : 0,
    isDisabled: value ? value?.[0].isDisabled : false,
    activationTime: value ? Number(value?.[0].activationTime.toString()) : 0,
    roiIDs: value ? value?.[0].roiIDs : [],
    roiClaimTimestamp: value
      ? Number(value?.[0].roiClaimTimestamp.toString())
      : 0,
    roiClaimedUSD: value ? Number(formatEther(value?.[0].roiClaimedUSD)) : 0,
    selfBusinessUSDArray: value ? value?.[0].selfBusinessUSDArray : [],
    selfBusinessUSD: value
      ? Number(formatEther(value?.[0].selfBusinessUSD))
      : 0,
    directBusinessUSD: value
      ? Number(formatEther(value?.[0].directBusinessUSD))
      : 0,
    teamBusinessUSD: value
      ? Number(formatEther(value?.[0].teamBusinessUSD))
      : 0,
    teamIDs: value ? value?.[0].teamIDs : [],
    balanceClaimedUSD: value
      ? Number(formatEther(value?.[0].balanceClaimedUSD))
      : 0,

    limitBalanceUSD: value
      ? Number(formatEther(value?.[0].limitBalanceUSD))
      : 0,
    maxLimitAmount: value ? Number(formatEther(value?.[0].maxLimitAmount)) : 0,
    referralPaidUSD: value
      ? Number(formatEther(value?.[0].referralPaidUSD))
      : 0,
    rewardPaidRoyaltyClubUSD: value
      ? Number(formatEther(value?.[0].rewardPaidRoyaltyClubUSD))
      : 0,
    royaltyClubBusinessUSD: value
      ? Number(formatEther(value?.[0].royaltyClubBusinessUSD))
      : 0,
    royaltyClubListIndex: value
      ? Number(value?.[0].royaltyClubListIndex.toString())
      : 0,
    royaltyClubPackageID: value
      ? Number(value?.[0].royaltyClubPackageID.toString())
      : 0,
    timeStampRoyaltyClub: value
      ? Number(value?.[0].timeStampRoyaltyClub.toString())
      : 0,
  };
  return valueObject;
};

export const useGetIDTotalBusiness = (id: number) => {
  const value = useCallHook("getIDTotalBusiness", [id]);
  const valueObject = {
    selfBusinessUSDArray: value ? value?.selfBusinessUSDArray : [],
    selfBusinessUSD: value ? Number(formatEther(value?.selfBusinessUSD)) : 0,
    directBusinessUSD: value
      ? Number(formatEther(value?.directBusinessUSD))
      : 0,
    teamBusinessUSD: value ? Number(formatEther(value?.teamBusinessUSD)) : 0,
  };
  return valueObject;
};

export const useGetIDTeam = (
  id: number
): {
  team: number[];
  teamCount: number;
} => {
  const value = useCallHook("getIDTeam", [id]);
  const valueObject = {
    team: value ? value?.team : [],
    teamCount: value ? Number(value?.teamCount?.toString()) : 0,
  };
  return valueObject;
};

export const useGetIDRewardPaid = (
  id: number
): {
  referralUSD: number;
  roiUSD: number;
  royaltyUSD: number;
  totalRewardPaid: number;
} => {
  const value = useCallHook("getIDRewardPaid", [id]);
  const valueObject = {
    referralUSD: value ? Number(formatEther(value?.referralUSD)) : 0,
    roiUSD: value ? Number(formatEther(value?.roiUSD)) : 0,
    royaltyUSD: value ? Number(formatEther(value?.royaltyUSD)) : 0,
    totalRewardPaid: value ? Number(formatEther(value?.totalRewardPaid)) : 0,
  };
  return valueObject;
};
