import { useCall, useEthers } from "@usedapp/core";
import { useSupportedNetworkInfo } from "../constants";

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