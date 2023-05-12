import { useCall, useEthers } from "@usedapp/core";
import { formatEther } from "ethers/lib/utils";
import { useSupportedNetworkInfo } from "../constants";

export const useCallHook = (methodName: string, arg: any[]) => {
    const { chainId } = useEthers();
    const currentNetwork = useSupportedNetworkInfo[chainId!];
    const { value, error } =
      useCall(
        currentNetwork?.futureSecureWalletContractAddress && {
          contract: currentNetwork?.futureSecureWalletContractInterface,
          method: methodName,
          args: arg,
        }
      ) ?? {};
  
    if (error) {
      console.error('ROI Hooks Error', error.message);
      return undefined;
    }
    return value;
  };

  export const useFutureGetUserTotalValueStaked = (address: string | undefined) => {
    const value = useCallHook("getUserTotalValueStaked", [address])?.[0];
    const valueFormatted = value ? Number(formatEther(value)) : 0
    return valueFormatted;
  }
  export const useFutureGetUserAllStakingsRewards = (address: string | undefined) => {
    const value = useCallHook("getUserAllStakingsRewards", [address])?.[0];
    const valueFormatted = value ? Number(formatEther(value)) : 0
    return valueFormatted;
  }

  export const useFutureGetUserTotalRewardClaimedToken = (address: string | undefined) => {
    const value = useCallHook("getUserTotalRewardClaimedToken", [address])?.[0];
    const valueFormatted = value ? Number(formatEther(value)) : 0
    return valueFormatted;
  }

  export const useFutureGetStakingTimeEndTime = (address: string | undefined) => {
    const value = useCallHook("getStakingTimeEndTime", [address])?.[0];
    const valueFormatted = value ? Number(value) : 0
    return valueFormatted;
  }