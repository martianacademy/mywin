import { useCall, useEthers } from "@usedapp/core";
import { formatEther } from "ethers/lib/utils";
import { useSupportedNetworkInfo } from "../constants";

export const useCallHook = (methodName: string, arg: any[]) => {
    const { chainId } = useEthers();
    const currentNetwork = useSupportedNetworkInfo[chainId!];
    const { value, error } =
      useCall(
        currentNetwork?.roiContractAddress && {
          contract: currentNetwork?.roiContractInterface,
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

  export const useROIAccount = (roiID: string | undefined) => {
    const value = useCallHook('getROIAccount', [roiID ?? '0']);
    const valueObject = {
      id: value ? value?.[0]?.id : 0,
      isActive: value ? value?.[0]?.isActive : false,
      ownerID: value ? value?.[0]?.ownerID : '0',
      value: value ? Number(formatEther(value?.[0]?.value)) : 0,
      roiRate: value ? Number(value?.[0]?.roiRate) : 0,
      startTime: value ? Number(value?.[0]?.startTime) : 0,
    };
    return valueObject;
  };

  export const useGetUserIDTotalROI = (userID: string | undefined) => {
    const value = useCallHook('getUserIDTotalROI', [userID ?? '0'])?.[0];
    const valueFormatted = value ? Number(formatEther(value ?? 0)) : 0;
  
    return valueFormatted;
  };

  export const useGetUserAllActiveROIValue = (userID: string | undefined) => {
    const value = useCallHook('getUserTotalActiveROIValue', [userID ?? '0'])?.[0];
    const valueFormatted = value ? Number(formatEther(value ?? 0)) : 0;
  
    return valueFormatted;
  };

