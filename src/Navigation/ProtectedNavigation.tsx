import { VStack } from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { useSupportedNetworkInfo } from "../constants";
import { ConnectWalletPage } from "../pages/Error/ConnectWalletPage";
import { SwitchToSupportedNetwork } from "../pages/Error/SwitchToSupportedNetworkPage";

export const ProtectedNavigation = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { account, chainId } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  return (
    <VStack>
      {account ? (
        currentNetwork ? (
          children
        ) : (
          <SwitchToSupportedNetwork />
        )
      ) : (
        <ConnectWalletPage />
      )}
      ;
    </VStack>
  );
};
