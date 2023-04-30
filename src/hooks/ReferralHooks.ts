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
  accountIDs: number[];
} => {
  const value = useCallHook("getUserAccount", [address]);
  const valueObject = {
    isDisabled: value ? value?.[0].isDisabled : false,
    accountIDs: value ? value?.[0].accountIDs : [],
  };
  return valueObject;
};

export interface userIDAccountType {
  id: string;
  oldID: string;
  owner: string;
  refereeIDs: string[] | [];
  refererID: string;
  isDisabled: boolean;
  joiningTime: number;
  activationTime: number;
  deactivateTime: number;
  roiIDs: string[] | [];
  roiClaimTimestamp: number;
  roiClaimedUSD: number;
  selfBusinessUSD: number;
  selfBusinessUSDOld: number;
  directBusinessUSD: number;
  directBusinessUSDOld: number;
  teamBusinessUSD: number;
  teamBusinessUSDOld: number;
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

export const useIDAccount = (id: number | string | undefined): userIDAccountType => {
  const value = useCallHook("getIDAccount", [id ?? "0"]);
  const valueObject = {
    id: value ? value?.[0].id.toString() : 0,
    oldID: value ? value?.[0].oldID.toString() : "0",
    isDisabled: value ? value?.[0].isDisabled : false,
    owner: value ? value?.[0].owner : AddressZero,
    joiningTime: value ? Number(value?.[0].joiningTime.toString()) : 0,
    activationTime: value ? Number(value?.[0].activationTime.toString()) : 0,
    deactivateTime: value ? Number(value?.[0].deactivateTime.toString()) : 0,
    refererID: value ? value?.[0].refererID.toString() : 0,
    roiIDs: value ? value?.[0].roiIDs : [],
    refereeIDs: value ? value?.[0].refereeIDs : [],
    teamIDs: value ? value?.[0].teamIDs : [],
    roiClaimTimestamp: value
      ? Number(value?.[0].roiClaimTimestamp.toString())
      : 0,
    roiClaimedUSD: value ? Number(formatEther(value?.[0].roiClaimedUSD)) : 0,
    selfBusinessUSD: value
      ? Number(formatEther(value?.[0].selfBusinessUSD))
      : 0,
    selfBusinessUSDOld: value
      ? Number(formatEther(value?.[0].selfBusinessUSDOld))
      : 0,
    directBusinessUSD: value
      ? Number(formatEther(value?.[0].directBusinessUSD))
      : 0,
    directBusinessUSDOld: value
      ? Number(formatEther(value?.[0].directBusinessUSDOld))
      : 0,
    teamBusinessUSD: value
      ? Number(formatEther(value?.[0].teamBusinessUSD))
      : 0,
    teamBusinessUSDOld: value
      ? Number(formatEther(value?.[0].teamBusinessUSDOld))
      : 0,

    royaltyClubBusinessUSD: value
      ? Number(formatEther(value?.[0].royaltyClubBusinessUSD))
      : 0,

    timeStampRoyaltyClub: value
      ? Number(value?.[0].timeStampRoyaltyClub.toString())
      : 0,
    royaltyClubPackageID: value
      ? Number(value?.[0].royaltyClubPackageID.toString())
      : 0,
    royaltyClubListIndex: value
      ? Number(value?.[0].royaltyClubListIndex.toString())
      : 0,

    referralPaidUSD: value
      ? Number(formatEther(value?.[0].referralPaidUSD))
      : 0,
    rewardPaidRoyaltyClubUSD: value
      ? Number(formatEther(value?.[0].rewardPaidRoyaltyClubUSD))
      : 0,

    balanceClaimedUSD: value
      ? Number(formatEther(value?.[0].balanceClaimedUSD))
      : 0,

    limitBalanceUSD: value
      ? Number(formatEther(value?.[0].limitBalanceUSD))
      : 0,
    maxLimitAmount: value ? Number(formatEther(value?.[0].maxLimitAmount)) : 0,
  };

  return valueObject;
};

export const useROIAccount = (roiID: string | undefined) => {
  const value = useCallHook("getROIAccount", [roiID ?? "0"]);
  const valueObject = {
    isActive: value ? value?.[0]?.isActive : false,
    ownerID: value ? value?.[0]?.ownerID : "0",
    valueInUSD: value ? Number(formatEther(value?.[0]?.valueInUSD)) : 0,
    roiRate: value ? Number(value?.[0]?.roiRate) : 0,
    startTime: value ? Number(value?.[0]?.startTime) : 0,
    duration: value ? Number(value?.[0]?.duration) : 0,
  };

  return valueObject;
};

export const useGetUserAllActiveROIValue = (userID: string | undefined) => {
  const value = useCallHook("getUserTotalActiveROIValue", [userID ?? "0"]);
  const valueFormatted = value ? Number(formatEther(value?.[0] ?? 0)) : 0;

  return valueFormatted;
};

export const useGetUserIDTotalROI = (userID: string | undefined) => {
  const value = useCallHook("getUserIDTotalROI", [userID ?? "0"]);
  const valueFormatted = value ? Number(formatEther(value?.[0] ?? 0)) : 0;

  return valueFormatted;
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

export const useMinContributionETH = () => {
  const value = useCallHook("getMinContributionETH", [])?.[0];
  return value ? Number(formatEther(value ?? 0)) : 0;
}
