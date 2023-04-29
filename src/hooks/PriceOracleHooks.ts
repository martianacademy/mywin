import { useCall, useEthers } from "@usedapp/core";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { AddressZero, useSupportedNetworkInfo } from "../constants";

const useCallHook = (methodName: string, arg: any[]) => {
  const { chainId } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  const { value, error } =
    useCall(
      currentNetwork?.priceOracleContractAddress && {
        contract: currentNetwork?.priceOracleContractInterface,
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



export const useCoinPrice = () => {
  const value = useCallHook("getPriceInUSD", [])?.[0];
  const valueFormatted = value ? Number(formatEther(value)) : 0

  return valueFormatted;
}