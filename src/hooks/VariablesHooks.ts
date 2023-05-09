import { useCall, useEthers } from "@usedapp/core";
import { AddressZero, useSupportedNetworkInfo } from "../constants";

export const useCallHook = (methodName: string, arg: any[]) => {
    const { chainId } = useEthers();
    const currentNetwork = useSupportedNetworkInfo[chainId!];
    const { value, error } =
      useCall(
        currentNetwork?.variablesContractAddress && {
          contract: currentNetwork?.variablesContractInterface,
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

  export const useVariablesIsAdmin = (address: string | undefined) => {
    const value = useCallHook("isAdmin", [address ?? AddressZero])?.[0];
   return value;
  }