import { useCall, useEthers } from "@usedapp/core";
import { formatEther } from "ethers/lib/utils";
import { useSupportedNetworkInfo } from "../constants";

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
