import { useCall, useEthers } from '@usedapp/core';
import { formatEther } from 'ethers/lib/utils';
import { useSupportedNetworkInfo } from '../constants';

const useCallHook = (methodName: string, arg: any[]) => {
  const { chainId } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  const { value, error } =
    useCall(
      {
        contract: currentNetwork?.priceOracleContractInterface,
        method: methodName,
        args: arg,
      }
    ) ?? {};

  if (error) {
    console.error('PriceOracle Hooks', error.message);
    return undefined;
  }
  return value;
};

export const useCoinPrice = () => {
  const value = useCallHook("getPriceInUSD", []);
  const valueFormatted = value ? Number(formatEther(value?.[0])) : 0
  return valueFormatted;
}
