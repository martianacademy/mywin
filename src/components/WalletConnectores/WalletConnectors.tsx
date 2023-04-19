import { Hide, Image, Text, VStack, Wrap } from "@chakra-ui/react";
import {
  CoinbaseWalletConnector,
  MetamaskConnector,
  useEthers,
} from "@usedapp/core";
import { motion } from "framer-motion";
import {
  CoinbaseWalletLogoSVG,
  MetamaskWalletLogoSVG,
  WalletConnectLogoSVG,
} from "../../assets";
import { DeepLinks } from "../../constants";

const MotionVStack = motion(VStack);

const WalletContainer = ({
  logo,
  name,
  onClick,
}: {
  logo: string;
  name: string;
  onClick?: () => void;
}) => {
  return (
    <MotionVStack
      whileHover={{
        y: -10,
      }}
      whileTap={{
        scale: 0.95,
      }}
      cursor="pointer"
    >
      <Image
        src={logo}
        boxSize={14}
        p={1}
        bgColor="green.100"
        borderRadius="3xl"
        borderWidth="thin"
        onClick={onClick}
      ></Image>
      <Text fontSize="xs">{name}</Text>
    </MotionVStack>
  );
};

export const WalletConnectors = () => {
  const { error, activate, activateBrowserWallet } = useEthers();
  const handleConnectMetamask = async () => {
    const MetamaskProvider = new MetamaskConnector();
    if (window.ethereum) {
      try {
        await activate(MetamaskProvider);
      } catch (err: any) {
        console.log(err);
      }
    } else {
      window.location.href = `${DeepLinks.metamask}`;
    }
  };
  const handleConnectTrustWallet = async () => {
    if (window.ethereum) {
      try {
        activateBrowserWallet();
      } catch (err) {
        console.log(err);
      }
    } else {
      window.location.href = `${DeepLinks.trustwallet}`;
    }
  };
  const handleConnectCoinbaseWallet = async () => {
    const CoinbaseProvider = new CoinbaseWalletConnector();
    if (window.ethereum) {
      try {
        await activate(CoinbaseProvider);
      } catch (err) {
        console.log(err);
      }
    } else {
      window.location.href = `${DeepLinks.coinbase}`;
    }
  };
  const handleConnectWalletConnect = async () => {
    try {
      activateBrowserWallet({ type: "walletConnect" });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Wrap py={10} spacing={5} justify="center">
      <Hide below="sm">
        <WalletContainer
          logo={MetamaskWalletLogoSVG}
          name="Metamask"
          onClick={handleConnectMetamask}
        ></WalletContainer>
        {/* <WalletContainer
          logo={TrustWalletLogoSVG}
          name="Trustwallet"
          onClick={handleConnectTrustWallet}
        ></WalletContainer> */}
        <WalletContainer
          logo={CoinbaseWalletLogoSVG}
          name="Coinbase"
          onClick={handleConnectCoinbaseWallet}
        ></WalletContainer>
      </Hide>
      <WalletContainer
        logo={WalletConnectLogoSVG}
        name="WalletConnect"
        onClick={handleConnectWalletConnect}
      ></WalletContainer>
    </Wrap>
  );
};
