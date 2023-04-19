import { useConfig, useEthers } from "@usedapp/core";
import React from "react";
import { useSupportedNetworkInfo } from "../constants";
import { ConnectWalletPage } from "../pages/Error/ConnectWalletPage";

export const UnsaupportedNetwork = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { account, chainId } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];

  return account ? "" : <ConnectWalletPage></ConnectWalletPage>;
};
