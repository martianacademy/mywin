import { BSCTestnet, Config } from "@usedapp/core";
import { WalletConnectConnector } from "@usedapp/wallet-connect-connector";
import { MyVeeChain } from "./ChainInfo";

export const DappConfig: Config = {
  readOnlyChainId: MyVeeChain.chainId,
  readOnlyUrls: {
    [MyVeeChain.chainId]: "https://rpc.myveescan.com",
    [BSCTestnet.chainId]: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  },
  networks: [MyVeeChain, BSCTestnet],
  connectors: {
    walletConnect: new WalletConnectConnector({
      rpc: {
        [MyVeeChain.chainId]: "https://rpc.myveescan.com",
        [BSCTestnet.chainId]: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      },
      qrcodeModalOptions: {
        desktopLinks: [
          "metamask",
          "ledger",
          "tokenary",
          "wallet",
          "wallet 3",
          "secuX",
          "ambire",
          "wallet3",
          "apolloX",
          "zerion",
          "sequence",
          "punkWallet",
          "kryptoGO",
          "nft",
          "riceWallet",
          "vision",
          "keyring",
        ],
        mobileLinks: ["metamask", "trust"],
      },
    }),
  },
};
